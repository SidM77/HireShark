from flask import Flask, request, jsonify
import speech_recognition as sr
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    filename = secure_filename(audio_file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(filepath)

    recognizer = sr.Recognizer()
    with sr.AudioFile(filepath) as source:
        audio_data = recognizer.record(source)

        try:
            text = recognizer.recognize_google(audio_data)
            print(f"Transcription: {text}")
            return jsonify({"transcription": text})
        except sr.UnknownValueError:
            return jsonify({"error": "Could not understand the audio"}), 400
        except sr.RequestError:
            return jsonify({"error": "Error with speech recognition service"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
