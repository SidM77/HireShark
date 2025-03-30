from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
import sys
import time
import json
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def wait_for_file(file_path, timeout=30):
    """
    Wait for a file to exist with a timeout.
    Returns True if file exists, False if timeout is reached.
    """
    start_time = time.time()
    while not os.path.exists(file_path):
        if time.time() - start_time > timeout:
            return False
        time.sleep(0.5)  # Check every 0.5 seconds

    logger.info("File found")
    return True

@app.route('/process-test', methods=['POST'])
def process_test():
    try:
        data = request.get_json()
        video_path = data.get('video_path')
        test_score = data.get('test_score')
        user_email = data.get('user_email')  # Get the user's email
        job_id = data.get('job_id')  # Get the job ID

        logger.info(f"Received request data: {data}")

        if not video_path or test_score is None or not user_email or not job_id:
            return jsonify({'status': 'error', 'message': 'Missing video_path, test_score, user_email, or job_id'}), 400

        # Get the downloads directory path and normalize the path
        downloads_dir = os.path.expanduser('~/Downloads')
        full_video_path = os.path.abspath(os.path.join(downloads_dir, video_path))
        
        # Log the full path for debugging
        logger.info(f"Full video path: {full_video_path}")
        logger.info(f"File exists: {os.path.exists(full_video_path)}")
        logger.info(f"Processing test for user: {user_email}")
        logger.info(f"Job ID: {job_id}")

        # Wait for the video file to exist
        if not wait_for_file(full_video_path):
            return jsonify({
                'status': 'error',
                'message': f'Video file not found after waiting: {full_video_path}'
            }), 404

        # Additional check to ensure file is fully downloaded
        file_size = -1
        while True:
            current_size = os.path.getsize(full_video_path)
            if current_size == file_size:
                break
            file_size = current_size
            time.sleep(0.5)

        logger.info(f"File size: {file_size} bytes")

        # Get the directory containing app.py
        current_dir = os.path.dirname(os.path.abspath(__file__))
        logger.info(f"Current directory: {current_dir}")

        # Run the Python script with the video path, test score, user email, and job ID
        try:
            # Change to the directory containing app.py before running the script
            os.chdir(current_dir)
            
            # Run the script with the full path
            result = subprocess.run(
                [sys.executable, 'run.py', full_video_path, str(test_score), user_email, str(job_id)],
                capture_output=True,
                text=True,
                cwd=current_dir
            )

            # Log the output
            logger.info("=== Script Output ===")
            logger.info(result.stdout)
            if result.stderr:
                logger.error("=== Script Errors ===")
                logger.error(result.stderr)

            if result.returncode != 0:
                logger.error(f"Error running analysis. Return code: {result.returncode}")
                return jsonify({
                    'status': 'error',
                    'message': f'Error running analysis: {result.stderr}'
                }), 500

            # Parse the output to get the statistics
            stats = {}
            for line in result.stdout.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip()
                    value = value.strip()
                    if key in ['susSpikeCount', 'audioCheatCount', 'totalHeadMovements', 'globalCheat', 'detectionRate', 'multipleFacesDetected', 'userEmail', 'testScore', 'jobId']:
                        try:
                            if key == 'detectionRate':
                                stats[key] = float(value)
                            elif key == 'multipleFacesDetected':
                                stats[key] = bool(int(value))
                            elif key == 'testScore':
                                stats[key] = int(float(value))  # Convert to float first, then to int
                            elif key == 'jobId':
                                stats[key] = str(value)  # Keep jobId as string
                            else:
                                stats[key] = int(value)
                        except ValueError:
                            stats[key] = value

            logger.info(f"Final statistics: {stats}")
            return jsonify({
                'status': 'success',
                'message': 'Test processed successfully',
                'stats': stats,
            })

        except Exception as e:
            logger.error(f"Exception details: {str(e)}")
            logger.error("Traceback:", exc_info=True)
            return jsonify({
                'status': 'error',
                'message': f'Error running analysis: {str(e)}'
            }), 500

    except Exception as e:
        logger.error(f"Server error details: {str(e)}")
        logger.error("Traceback:", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }), 500

# Route to serve index.html for /round1/<id> requests
@app.route('/round1/<id>')
def serve_round1(id):
    try:
        # Get the directory containing app.py
        current_dir = os.path.dirname(os.path.abspath(__file__))
        logger.info(f"Serving index.html for round1/{id}")
        return send_from_directory(current_dir, 'index.html')
    except Exception as e:
        logger.error(f"Error serving index.html: {str(e)}")
        return jsonify({'error': 'Failed to serve index.html'}), 500

if __name__ == '__main__':
    app.run(debug=True)
