import os
import sys
import warnings

# Suppress all warnings first
warnings.filterwarnings('ignore')

# Set environment variables before any other imports
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_ENABLE_DYNAMIC_SHAPES'] = '0'
os.environ['TF_CPP_MIN_VLOG_LEVEL'] = '0'
os.environ['MEDIAPIPE_DISABLE_GPU'] = '1'
os.environ['MEDIAPIPE_DISABLE_GPU_DEBUG'] = '1'
os.environ['MEDIAPIPE_DISABLE_GRAPH_LOGGING'] = '1'
os.environ['MEDIAPIPE_DISABLE_GRAPH_VERBOSE'] = '1'
os.environ['MEDIAPIPE_DISABLE_GRAPH_DEBUG'] = '1'
os.environ['MEDIAPIPE_DISABLE_GRAPH_INFO'] = '1'
os.environ['MEDIAPIPE_DISABLE_GRAPH_WARNING'] = '1'
os.environ['MEDIAPIPE_DISABLE_GRAPH_ERROR'] = '1'
os.environ['OPENCV_VIDEOIO_DEBUG'] = '0'
os.environ['OPENCV_VIDEOIO_PRIORITY_MSMF'] = '0'
os.environ['OPENCV_LOG_LEVEL'] = 'OFF'
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

# Now import other modules
import time
from glob import glob
from itertools import count
import cv2
import mediapipe as mp
import numpy as np
import threading as th
import sounddevice as sd
import audio
import logging
import queue
import traceback

# Configure logging to show important messages
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    force=True  # Force reconfiguration of the root logger
)

# Only suppress MediaPipe logs
logging.getLogger('mediapipe').setLevel(logging.CRITICAL)
logging.getLogger('mediapipe.python').setLevel(logging.CRITICAL)
logging.getLogger('mediapipe.python.solution').setLevel(logging.CRITICAL)
logging.getLogger('mediapipe.python.solution.face_mesh').setLevel(logging.CRITICAL)
logging.getLogger('mediapipe.python.solution.drawing_utils').setLevel(logging.CRITICAL)
logging.getLogger('mediapipe.python.solution.core').setLevel(logging.CRITICAL)
logging.getLogger('mediapipe.python.solution.graph').setLevel(logging.CRITICAL)
logging.getLogger('mediapipe.python.solution.graph_runner').setLevel(logging.CRITICAL)
logging.getLogger('mediapipe.python.solution.graph_runner_utils').setLevel(logging.CRITICAL)
logging.getLogger('mediapipe.python.solution.graph_runner_utils_impl').setLevel(logging.CRITICAL)
logging.getLogger('mediapipe.python.solution.graph_runner_utils_impl_face_mesh').setLevel(logging.CRITICAL)

# Add a logger for our debug messages
logger = logging.getLogger('head_pose')
logger.setLevel(logging.INFO)

# Add a stream handler to ensure logs are visible
stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)

# place holders and global variables
x = 0                                       # X axis head pose
y = 0                                       # Y axis head pose

X_AXIS_CHEAT = 0
Y_AXIS_CHEAT = 0

# Head movement counters
LOOK_LEFT_COUNT = 0
LOOK_RIGHT_COUNT = 0
LOOK_DOWN_COUNT = 0
LOOK_UP_COUNT = 0
TOTAL_HEAD_MOVEMENTS = 0

# Multiple faces detection flag
MULTIPLE_FACES_DETECTED = False

# Movement thresholds (adjusted for better sensitivity)
LEFT_THRESHOLD = -10    # Balanced threshold for left movement
RIGHT_THRESHOLD = 10    # Balanced threshold for right movement
DOWN_THRESHOLD = -10    # Balanced threshold for down movement
UP_THRESHOLD = 10       # Balanced threshold for up movement

# Movement cooldown and minimum movement duration
MOVEMENT_COOLDOWN = 0.2  # Balanced cooldown between movements
MIN_MOVEMENT_DURATION = 0.15  # Balanced minimum duration for a movement to be counted

def pose(video_path, output_queue):
    global VOLUME_NORM, x, y, X_AXIS_CHEAT, Y_AXIS_CHEAT
    global LOOK_LEFT_COUNT, LOOK_RIGHT_COUNT, LOOK_DOWN_COUNT, LOOK_UP_COUNT, TOTAL_HEAD_MOVEMENTS
    global MULTIPLE_FACES_DETECTED
    
    try:
        # Reset counters at the start of processing
        LOOK_LEFT_COUNT = 0
        LOOK_RIGHT_COUNT = 0
        LOOK_DOWN_COUNT = 0
        LOOK_UP_COUNT = 0
        TOTAL_HEAD_MOVEMENTS = 0
        MULTIPLE_FACES_DETECTED = False
        
        logger.info("\n=== Starting Head Pose Detection ===")
        logger.info(f"Processing video: {video_path}")
        
        # Check if video file exists
        if not os.path.exists(video_path):
            error_msg = f"Error: Video file not found: {video_path}"
            logger.error(error_msg)
            output_queue.put({'error': error_msg})
            return
            
        #############################
        mp_face_mesh = mp.solutions.face_mesh
        face_mesh = mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=2,  # Changed from 1 to 2 to allow multiple face detection
            min_detection_confidence=0.3,
            min_tracking_confidence=0.3,
            refine_landmarks=True
        )
        
        logger.info("Opening video file...")
        cap = cv2.VideoCapture(video_path)
        
        # Check if video opened successfully
        if not cap.isOpened():
            error_msg = f"Error: Could not open video file: {video_path}"
            logger.error(error_msg)
            output_queue.put({'error': error_msg})
            return
            
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        logger.info(f"Video FPS: {fps}, Total frames: {total_frames}")
        
        if total_frames == 0:
            error_msg = "Error: Video has no frames"
            logger.error(error_msg)
            output_queue.put({'error': error_msg})
            return
            
        delay = 1 / fps - 0.001
        
        # Get video dimensions
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        logger.info(f"Video dimensions: {width}x{height}")
        
        # Create output video writer
        output_path = os.path.splitext(video_path)[0] + '_with_face_mesh.mp4'
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        if not out.isOpened():
            error_msg = "Error: Could not create output video file"
            logger.error(error_msg)
            output_queue.put({'error': error_msg})
            return
            
        mp_drawing = mp.solutions.drawing_utils
        logger.info("Processing video frames...")

        # Initialize movement state
        last_movement = None
        last_movement_time = time.time()
        movement_start_time = time.time()
        frame_count = 0
        face_detected_count = 0
        movement_frames = 0  # Track consecutive frames with movement
        last_angles = None  # Track last angles for debugging

        while True:
            success, image = cap.read()
            if not success:
                logger.info(f"End of video reached at frame {frame_count}")
                break

            frame_count += 1
            if frame_count % 30 == 0:
                logger.info(f"\nProcessing frame {frame_count}/{total_frames}")

            try:
                # Flip and convert color space
                image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
                image.flags.writeable = False
                results = face_mesh.process(image)
                image.flags.writeable = True
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

                img_h, img_w, img_c = image.shape
                face_3d = []
                face_2d = []
                
                face_ids = [33, 263, 1, 61, 291, 199, 4, 64, 294, 168, 0, 11, 12, 13, 14, 15, 16, 17, 18, 200, 199, 175, 152, 148, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]

                if results.multi_face_landmarks:
                    # Check for multiple faces
                    num_faces = len(results.multi_face_landmarks)
                    if num_faces > 1 and not MULTIPLE_FACES_DETECTED:
                        MULTIPLE_FACES_DETECTED = True
                        logger.warning(f"Multiple faces detected in frame {frame_count}. Number of faces: {num_faces}")
                    
                    face_detected_count += 1
                    if frame_count % 30 == 0:
                        logger.info(f"Face detected in frame {frame_count}. Number of faces: {num_faces}")
                    
                    # Process only the first face for head pose detection
                    face_landmarks = results.multi_face_landmarks[0]
                    
                    # Draw face mesh for all detected faces
                    for face_landmarks in results.multi_face_landmarks:
                        mp_drawing.draw_landmarks(
                            image=image,
                            landmark_list=face_landmarks,
                            connections=mp_face_mesh.FACEMESH_CONTOURS,
                            landmark_drawing_spec=None)
                    
                    # Process head pose for the first face only
                    for idx, lm in enumerate(face_landmarks.landmark):
                        if idx in face_ids:
                            if idx == 1:
                                nose_2d = (lm.x * img_w, lm.y * img_h)
                                nose_3d = (lm.x * img_w, lm.y * img_h, lm.z * 8000)

                            x, y = int(lm.x * img_w), int(lm.y * img_h)
                            face_2d.append([x, y])
                            face_3d.append([x, y, lm.z])       
                    
                    face_2d = np.array(face_2d, dtype=np.float64)
                    face_3d = np.array(face_3d, dtype=np.float64)

                    focal_length = 1 * img_w
                    cam_matrix = np.array([ [focal_length, 0, img_h / 2],
                                          [0, focal_length, img_w / 2],
                                          [0, 0, 1]])

                    dist_matrix = np.zeros((4, 1), dtype=np.float64)
                    success, rot_vec, trans_vec = cv2.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)
                    rmat, jac = cv2.Rodrigues(rot_vec)
                    angles, mtxR, mtxQ, Qx, Qy, Qz = cv2.RQDecomp3x3(rmat)

                    # Get angles directly without smoothing
                    x = angles[0] * 360
                    y = angles[1] * 360
                    
                    if frame_count % 30 == 0:
                        logger.info(f"Frame {frame_count} - Raw angles - X: {x:.2f}, Y: {y:.2f}")
                        if last_angles is not None:
                            logger.info(f"Angle changes - X: {x - last_angles[0]:.2f}, Y: {y - last_angles[1]:.2f}")
                        last_angles = (x, y)
                    
                    current_time = time.time()
                    
                    if current_time - last_movement_time >= MOVEMENT_COOLDOWN:
                        # Initialize text variable
                        text = "Forward"
                        
                        # Horizontal movement
                        if abs(y) > abs(x):  # Horizontal movement is dominant
                            if y < LEFT_THRESHOLD:  # Looking left
                                if last_movement != "left":
                                    movement_start_time = current_time
                                    last_movement = "left"
                                    movement_frames = 1
                                    logger.info(f"Starting left movement detection at frame {frame_count}")
                                elif current_time - movement_start_time >= MIN_MOVEMENT_DURATION:
                                    movement_frames += 1
                                    if movement_frames >= 3:  # Require at least 3 consecutive frames
                                        logger.info(f"LEFT movement detected! X: {x:.2f}, Y: {y:.2f}")
                                        text = "Looking Left"
                                        LOOK_LEFT_COUNT += 1
                                        TOTAL_HEAD_MOVEMENTS += 1
                                        last_movement_time = current_time
                                        movement_start_time = current_time
                                        movement_frames = 0
                            elif y > RIGHT_THRESHOLD:  # Looking right
                                if last_movement != "right":
                                    movement_start_time = current_time
                                    last_movement = "right"
                                    movement_frames = 1
                                    logger.info(f"Starting right movement detection at frame {frame_count}")
                                elif current_time - movement_start_time >= MIN_MOVEMENT_DURATION:
                                    movement_frames += 1
                                    if movement_frames >= 3:  # Require at least 3 consecutive frames
                                        logger.info(f"RIGHT movement detected! X: {x:.2f}, Y: {y:.2f}")
                                        text = "Looking Right"
                                        LOOK_RIGHT_COUNT += 1
                                        TOTAL_HEAD_MOVEMENTS += 1
                                        last_movement_time = current_time
                                        movement_start_time = current_time
                                        movement_frames = 0
                            else:
                                text = "Forward"
                                last_movement = None
                                movement_start_time = current_time
                                movement_frames = 0
                        else:  # Vertical movement
                            if x < DOWN_THRESHOLD:  # Looking down
                                if last_movement != "down":
                                    movement_start_time = current_time
                                    last_movement = "down"
                                    movement_frames = 1
                                    logger.info(f"Starting down movement detection at frame {frame_count}")
                                elif current_time - movement_start_time >= MIN_MOVEMENT_DURATION:
                                    movement_frames += 1
                                    if movement_frames >= 3:  # Require at least 3 consecutive frames
                                        logger.info(f"DOWN movement detected! X: {x:.2f}, Y: {y:.2f}")
                                        text = "Looking Down"
                                        LOOK_DOWN_COUNT += 1
                                        TOTAL_HEAD_MOVEMENTS += 1
                                        last_movement_time = current_time
                                        movement_start_time = current_time
                                        movement_frames = 0
                            elif x > UP_THRESHOLD:  # Looking up
                                if last_movement != "up":
                                    movement_start_time = current_time
                                    last_movement = "up"
                                    movement_frames = 1
                                    logger.info(f"Starting up movement detection at frame {frame_count}")
                                elif current_time - movement_start_time >= MIN_MOVEMENT_DURATION:
                                    movement_frames += 1
                                    if movement_frames >= 3:  # Require at least 3 consecutive frames
                                        logger.info(f"UP movement detected! X: {x:.2f}, Y: {y:.2f}")
                                        text = "Looking Up"
                                        LOOK_UP_COUNT += 1
                                        TOTAL_HEAD_MOVEMENTS += 1
                                        last_movement_time = current_time
                                        movement_start_time = current_time
                                        movement_frames = 0
                            else:
                                text = "Forward"
                                last_movement = None
                                movement_start_time = current_time
                                movement_frames = 0
                        # Display the current angles and movement state
                        text = f"X: {int(x)} Y: {int(y)} {text}"
                        
                        # Update cheat flags based on current angles
                        if y < LEFT_THRESHOLD or y > RIGHT_THRESHOLD:
                            X_AXIS_CHEAT = 1
                        else:
                            X_AXIS_CHEAT = 0

                        if x < DOWN_THRESHOLD:
                            Y_AXIS_CHEAT = 1
                        else:
                            Y_AXIS_CHEAT = 0

                        nose_3d_projection, jacobian = cv2.projectPoints(nose_3d, rot_vec, trans_vec, cam_matrix, dist_matrix)
                        p1 = (int(nose_2d[0]), int(nose_2d[1]))
                        p2 = (int(nose_3d_projection[0][0][0]), int(nose_3d_projection[0][0][1]))
                           
                        cv2.putText(image, text, (20, 20), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                        count_text = f"Left: {LOOK_LEFT_COUNT} Right: {LOOK_RIGHT_COUNT} Down: {LOOK_DOWN_COUNT} Up: {LOOK_UP_COUNT} Total: {TOTAL_HEAD_MOVEMENTS}"
                        cv2.putText(image, count_text, (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                else:
                    if frame_count % 30 == 0:
                        logger.info(f"No face detected in frame {frame_count}")
            
                out.write(image)
                time.sleep(delay)
                
            except Exception as e:
                logger.error(f"Error processing frame {frame_count}: {str(e)}")
                continue

        logger.info(f"\n=== Processing Complete ===")
        logger.info(f"Total frames processed: {frame_count}")
        logger.info(f"Frames with face detected: {face_detected_count}")
        logger.info(f"Face detection rate: {(face_detected_count/frame_count)*100:.2f}%")
        logger.info(f"Total head movements detected: {TOTAL_HEAD_MOVEMENTS}")
        if MULTIPLE_FACES_DETECTED:
            logger.warning("Multiple faces were detected during the video")

    except Exception as e:
        error_msg = f"Error during processing: {str(e)}\n{traceback.format_exc()}"
        logger.error(error_msg)
        output_queue.put({'error': error_msg})
    finally:
        logger.info("Cleaning up resources...")
        # Clean up
        if 'cap' in locals():
            cap.release()
        if 'out' in locals():
            out.release()
        if 'face_mesh' in locals():
            face_mesh.close()

        # Put the statistics in the queue
        stats = {
            'LOOK_LEFT_COUNT': LOOK_LEFT_COUNT,
            'LOOK_RIGHT_COUNT': LOOK_RIGHT_COUNT,
            'LOOK_DOWN_COUNT': LOOK_DOWN_COUNT,
            'LOOK_UP_COUNT': LOOK_UP_COUNT,
            'TOTAL_HEAD_MOVEMENTS': TOTAL_HEAD_MOVEMENTS,
            'TOTAL_FRAMES': frame_count,
            'FACES_DETECTED': face_detected_count,
            'DETECTION_RATE': (face_detected_count/frame_count)*100 if frame_count > 0 else 0,
            'MULTIPLE_FACES_DETECTED': MULTIPLE_FACES_DETECTED
        }
        logger.info("Sending statistics to queue: %s", stats)
        output_queue.put(stats)

#############################
if __name__ == "__main__":
    try:
        logger.info("Starting head pose detection...")
        
        # Get the video path
        if len(sys.argv) < 2:
            logger.error("Error: No video path provided")
            sys.exit(1)
            
        video_path = sys.argv[1]

        # video_path = r"C:\Users\Krish\Pictures\Camera Roll\WIN_20250328_18_14_09_Pro.mp4"
        
        # Check if video file exists
        if not os.path.exists(video_path):
            logger.error(f"Error: Video file not found: {video_path}")
            sys.exit(1)
            
        logger.info(f"Found video file: {video_path}")
        
        # Create a queue for thread output
        output_queue = queue.Queue()
        
        # Start the thread
        t1 = th.Thread(target=pose, args=(video_path, output_queue))
        t1.start()
        
        # Wait for the thread to complete
        t1.join()
        
        try:
            # Get the statistics from the queue
            result = output_queue.get(timeout=1)  # Add timeout to prevent hanging
            
            # Check for errors
            if 'error' in result:
                logger.error(f"Error: {result['error']}")
                sys.exit(1)
            
            # Print the statistics
            logger.info("\nHead Movement Statistics:")
            logger.info(f"  Looking Left: {result['LOOK_LEFT_COUNT']} times")
            logger.info(f"  Looking Right: {result['LOOK_RIGHT_COUNT']} times")
            logger.info(f"  Looking Down: {result['LOOK_DOWN_COUNT']} times")
            logger.info(f"  Looking Up: {result['LOOK_UP_COUNT']} times")
            logger.info(f"  Total Head Movements: {result['TOTAL_HEAD_MOVEMENTS']} times")
            logger.info(f"  Total Frames: {result['TOTAL_FRAMES']}")
            logger.info(f"  Faces Detected: {result['FACES_DETECTED']}")
            logger.info(f"  Detection Rate: {result['DETECTION_RATE']:.2f}%")
        except queue.Empty:
            logger.error("Error: No statistics received from processing thread")
            sys.exit(1)
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        logger.error("Traceback:")
        traceback.print_exc()
        sys.exit(1)
    finally:
        logger.info("Processing complete.")
        sys.exit(0)