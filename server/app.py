"""
Flask application for Sydney TTS - PDF to audio conversion.
"""
from io import BytesIO

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import torchaudio as ta
from chatterbox.tts import ChatterboxTTS
from pypdf import PdfReader

app = Flask(__name__)
CORS(app)


@app.route("/convertPDFToAudio", methods=["POST"])
def convert_pdf_to_audio():
    """
    Convert an uploaded PDF to audio.
    Expects a multipart form with:
      - 'pdf': the PDF file
      - 'audioFile': optional output audio filename (without .wav)
    Returns the generated audio as a .wav file on success.
    """
    if "pdf" not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files["pdf"]
    if pdf_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not pdf_file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "File must be a PDF"}), 400

    audio_file = request.form.get("audioFile", "").strip() or "audio"
    if not audio_file.lower().endswith(".wav"):
        audio_file = f"{audio_file}.wav"

    reader = PdfReader(pdf_file)
    full_text = " ".join(
        [page.extract_text() for page in reader.pages if page.extract_text()]
    )

    model = ChatterboxTTS.from_pretrained(device="cpu")
    wav = model.generate(full_text)

    buffer = BytesIO()
    ta.save(buffer, wav, model.sr, format="wav")
    buffer.seek(0)

    return send_file(
        buffer,
        mimetype="audio/wav",
        as_attachment=True,
        download_name=audio_file,
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
