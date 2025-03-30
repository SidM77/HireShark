import threading
import time
from moviepy import VideoFileClip
import audio
import head_pose
import detection
import sys
import os
import queue
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if len(sys.argv) != 5:
    print("Usage: python run.py <video_path> <test_score> <user_email> <job_id>")
    sys.exit(1)

# Get video path, test score, user email, and job ID from command line arguments
video_path = os.path.abspath(sys.argv[1])  # Convert to absolute path
test_score = int(float(sys.argv[2]))  # Convert to float first, then to int
user_email = sys.argv[3]
job_id = sys.argv[4]

# video_path = r"C:\Users\Krish\Downloads\quiz-recording-krish-at-gmail.com-2025-03-27T14-34-44-728Z.mp4"
# test_score = 5

logger.info(f"Absolute video path: {video_path}")
logger.info(f"File exists: {os.path.exists(video_path)}")
logger.info(f"Processing test for user: {user_email}")
logger.info(f"Job ID: {job_id}")

# Get video duration dynamically
try:
    clip = VideoFileClip(video_path)
    video_duration = clip.duration
    clip.close()
except Exception as e:
    logger.error(f"Error opening video file: {str(e)}")
    sys.exit(1)

logger.info(f"Processing video: {video_path}")
logger.info(f"Test score: {test_score}")
logger.info(f"Video duration: {video_duration} seconds")

# Create output queue for head pose detection
head_pose_queue = queue.Queue()

# Function to run head pose detection
def run_head_pose():
    try:
        head_pose.pose(video_path, head_pose_queue)
    except Exception as e:
        logger.error(f"Error in head pose detection: {str(e)}")
        head_pose_queue.put({'error': str(e)})

# Function to run audio analysis
def run_audio():
    try:
        audio.process_audio(video_path)
    except Exception as e:
        logger.error(f"Error in audio analysis: {str(e)}")

# Function to run cheating detection
def run_detection():
    try:
        detection.run_detection(video_duration, test_score)
    except Exception as e:
        logger.error(f"Error in cheating detection: {str(e)}")

# Start all processes in separate threads
video_thread = threading.Thread(target=run_head_pose)
audio_thread = threading.Thread(target=run_audio)
detection_thread = threading.Thread(target=run_detection)

video_thread.start()
audio_thread.start()
detection_thread.start()

# Wait for the video to finish
time.sleep(video_duration)

# After video ends, ensure all threads finish
video_thread.join()
audio_thread.join()
detection_thread.join()

logger.info("All processes completed.")

# Get head pose statistics from queue
head_pose_stats = {}
while not head_pose_queue.empty():
    try:
        stats = head_pose_queue.get_nowait()
        if 'error' in stats:
            logger.error(f"Head pose detection error: {stats['error']}")
        else:
            head_pose_stats.update(stats)
    except queue.Empty:
        break

# Print statistics in the format expected by app.py
print(f"susSpikeCount: {audio.SUS_SPIKE_COUNT}")
print(f"audioCheatCount: {audio.AUDIO_CHEAT_COUNT}")
print(f"totalHeadMovements: {head_pose.TOTAL_HEAD_MOVEMENTS}")
print(f"globalCheat: {detection.GLOBAL_CHEAT}")
print(f"detectionRate: {head_pose_stats.get('DETECTION_RATE', 0):.2f}")
print(f"multipleFacesDetected: {1 if head_pose_stats.get('MULTIPLE_FACES_DETECTED', False) else 0}")
print(f"userEmail: {user_email}")
print(f"testScore: {test_score}")
print(f"jobId: {job_id}")

# Log final statistics
logger.info(f"Final Statistics:")
logger.info(f"susSpikeCount: {audio.SUS_SPIKE_COUNT}")
logger.info(f"audioCheatCount: {audio.AUDIO_CHEAT_COUNT}")
logger.info(f"totalHeadMovements: {head_pose.TOTAL_HEAD_MOVEMENTS}")
logger.info(f"globalCheat: {detection.GLOBAL_CHEAT}")
logger.info(f"detectionRate: {head_pose_stats.get('DETECTION_RATE', 0):.2f}")
logger.info(f"multipleFacesDetected: {head_pose_stats.get('MULTIPLE_FACES_DETECTED', False)}")
logger.info(f"userEmail: {user_email}")
logger.info(f"testScore: {test_score}")
logger.info(f"jobId: {job_id}")
logger.info(f"Head Pose Stats: {head_pose_stats}")
