import numpy as np
import soundfile as sf
from pydub import AudioSegment
import os
import sys
import tempfile
import logging
import subprocess

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Placeholders and global variables
SOUND_AMPLITUDE = 0
AUDIO_CHEAT = 0
AUDIO_CHEAT_COUNT = 0
SUS_SPIKE_COUNT = 0

# Sound variables
CALLBACKS_PER_SECOND = 38               # Callbacks per second (system dependent)
SUS_FINDING_FREQUENCY = 2               # Calculates SUS *n* times every second
SOUND_AMPLITUDE_THRESHOLD = 5           # Further lowered threshold for better sensitivity

# Packing *n* frames to calculate SUS
FRAMES_COUNT = int(CALLBACKS_PER_SECOND / SUS_FINDING_FREQUENCY)
AMPLITUDE_LIST = [0] * FRAMES_COUNT
SUS_COUNT = 0
count = 0

def calculate_rms(indata):
    """Calculate the Root Mean Square (RMS) value of the audio data."""
    # Handle both mono and stereo audio
    if len(indata.shape) > 1:
        # For stereo, average both channels
        return np.sqrt(np.mean(indata**2)) * 1000
    return np.sqrt(np.mean(indata**2)) * 1000

def process_audio(file_path):
    """Extract and analyze audio from the recorded MP4 file."""
    global SOUND_AMPLITUDE, SUS_COUNT, count, AUDIO_CHEAT, AUDIO_CHEAT_COUNT, SUS_SPIKE_COUNT
    
    try:
        # Convert file path to absolute path and normalize it
        file_path = os.path.abspath(os.path.normpath(file_path))
        logger.info(f"Processing audio from: {file_path}")
        
        if not os.path.exists(file_path):
            logger.error(f"Error: Video file not found at {file_path}")
            return
            
        if not os.path.isfile(file_path):
            logger.error(f"Error: Path is not a file: {file_path}")
            return
            
        # Create a temporary file in the system's temp directory
        temp_dir = tempfile.gettempdir()
        temp_wav = os.path.join(temp_dir, f"temp_audio_{os.getpid()}.wav")
        logger.info(f"Temporary WAV file will be created at: {temp_wav}")
        
        # Extract audio from MP4
        try:
            audio = AudioSegment.from_file(file_path, format="mp4")
        except Exception as e:
            logger.error(f"Error extracting audio from MP4: {str(e)}")
            return
        
        # Convert to mono and set sample rate
        audio = audio.set_channels(1).set_frame_rate(16000)
        
        # Export as WAV
        try:
            audio.export(temp_wav, format="wav")
        except Exception as e:
            logger.error(f"Error exporting to WAV: {str(e)}")
            return
        
        if not os.path.exists(temp_wav):
            logger.error("Error: Failed to create temporary WAV file")
            return
            
        # Read the extracted WAV file
        try:
            data, samplerate = sf.read(temp_wav)
        except Exception as e:
            logger.error(f"Error reading WAV file: {str(e)}")
            return
        
        if len(data) == 0:
            logger.error("Error: No audio data found in the video")
            return
            
        # Process audio frame-by-frame
        frame_size = samplerate // CALLBACKS_PER_SECOND
        max_amplitude = 0
        min_amplitude = float('inf')
        
        for i in range(0, len(data), frame_size):
            frame = data[i:i+frame_size]
            if len(frame) == 0:
                continue
                
            rms_amplitude = calculate_rms(frame)
            max_amplitude = max(max_amplitude, rms_amplitude)
            min_amplitude = min(min_amplitude, rms_amplitude)
            
            AMPLITUDE_LIST.append(rms_amplitude)
            count += 1
            AMPLITUDE_LIST.pop(0)
            
            if count == FRAMES_COUNT:
                avg_amp = sum(AMPLITUDE_LIST) / FRAMES_COUNT
                SOUND_AMPLITUDE = avg_amp
                
                if avg_amp > SOUND_AMPLITUDE_THRESHOLD:
                    SUS_COUNT += 1
                    SUS_SPIKE_COUNT += 1
                    logger.info(f"High amplitude detected: {avg_amp:.2f} (threshold: {SOUND_AMPLITUDE_THRESHOLD})")
                else:
                    SUS_COUNT = 0
                
                if SUS_COUNT >= 2:
                    AUDIO_CHEAT = 1
                    AUDIO_CHEAT_COUNT += 1
                    logger.info(f"Audio cheat detected! SUS_COUNT: {SUS_COUNT}")
                else:
                    AUDIO_CHEAT = 0
                
                count = 0
        
        logger.info(f"Audio Statistics:")
        logger.info(f"  Max amplitude: {max_amplitude:.2f}")
        logger.info(f"  Min amplitude: {min_amplitude:.2f}")
        logger.info(f"  Average amplitude: {SOUND_AMPLITUDE:.2f}")
        logger.info(f"  Threshold: {SOUND_AMPLITUDE_THRESHOLD}")
        logger.info(f"  Total SUS Spike Count: {SUS_SPIKE_COUNT}")
        logger.info(f"  Total Audio Cheat: {AUDIO_CHEAT_COUNT}")
        
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
    finally:
        # Clean up temporary file
        if os.path.exists(temp_wav):
            try:
                os.remove(temp_wav)
                logger.info(f"Cleaned up temporary file: {temp_wav}")
            except Exception as e:
                logger.error(f"Error cleaning up temporary file: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        process_audio(sys.argv[1])
    else:
        print("Please provide a video file path")
    # process_audio(r"C:\Users\Krish\Pictures\Camera Roll\WIN_20250328_18_14_09_Pro.mp4")
