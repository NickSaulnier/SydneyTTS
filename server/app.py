"""
Flask application for Sydney TTS - PDF to audio conversion.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/convertPDFToAudio", methods=["POST"])
def convert_pdf_to_audio():
    """
    Convert an uploaded PDF to audio.
    Expects a multipart form with a 'pdf' file field.
    """
    if "pdf" not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files["pdf"]
    if pdf_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not pdf_file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "File must be a PDF"}), 400

    # TODO: Add PDF text extraction and TTS conversion logic
    # For now, return a placeholder response
    return jsonify({
        "message": "PDF received",
        "filename": pdf_file.filename,
    }), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
