from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import os
import subprocess
from werkzeug.utils import secure_filename
import tempfile
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/process-audio', methods=['POST'])
def process_audio():
    logger.info("Received audio processing request")

    if 'file' not in request.files:
        logger.error("No file in request")
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        logger.error("Empty filename")
        return jsonify({'error': 'No selected file'}), 400

    try:
        logger.info(f"Processing file: {file.filename}")

        # Save the uploaded webm file
        temp_webm = tempfile.NamedTemporaryFile(suffix='.webm', delete=False)
        file.save(temp_webm.name)
        logger.info(f"Saved WebM file to: {temp_webm.name}")

        # Create a temporary WAV file
        temp_wav = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
        logger.info(f"Created temporary WAV file: {temp_wav.name}")

        # Modified FFmpeg command with more detailed options
        conversion_command = [
            'ffmpeg',
            '-y',  # Overwrite output file if it exists
            '-i', temp_webm.name,
            '-vn',  # No video
            '-acodec', 'pcm_s16le',  # Output codec
            '-ar', '16000',  # Sample rate
            '-ac', '1',  # Mono
            '-f', 'wav',  # Force WAV format
            temp_wav.name
        ]

        logger.info("Starting FFmpeg conversion")
        logger.info(f"FFmpeg command: {' '.join(conversion_command)}")

        # Run FFmpeg with full output capture
        process = subprocess.run(
            conversion_command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Log the complete output
        logger.info(f"FFmpeg stdout: {process.stdout}")
        logger.info(f"FFmpeg stderr: {process.stderr}")

        if process.returncode != 0:
            logger.error(f"FFmpeg conversion failed with return code: {process.returncode}")
            raise Exception(f"FFmpeg conversion failed: {process.stderr}")

        logger.info("FFmpeg conversion successful")

        # Verify the output file exists and has size
        if not os.path.exists(temp_wav.name) or os.path.getsize(temp_wav.name) == 0:
            raise Exception("WAV file was not created or is empty")

        # Initialize recognizer
        logger.info("Initializing speech recognizer")
        recognizer = sr.Recognizer()

        # Load the audio file and transcribe
        logger.info("Starting transcription")
        with sr.AudioFile(temp_wav.name) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            logger.info(f"Transcription successful: {text}")

        # Clean up temporary files
        os.unlink(temp_webm.name)
        os.unlink(temp_wav.name)
        logger.info("Cleaned up temporary files")

        return jsonify({
            'success': True,
            'transcription': text
        })

    except Exception as e:
        # Clean up files in case of error
        try:
            if 'temp_webm' in locals():
                os.unlink(temp_webm.name)
            if 'temp_wav' in locals():
                os.unlink(temp_wav.name)
            logger.info("Cleaned up temporary files after error")
        except Exception as cleanup_error:
            logger.error(f"Error during cleanup: {cleanup_error}")

        logger.error(f"Error processing audio: {str(e)}", exc_info=True)
        return jsonify({
            'error': f"Error processing audio: {str(e)}"
        }), 500

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    app.run(debug=True)