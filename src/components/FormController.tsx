import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import AppButton from './AppButton';
import FileInput from './FileInput';
import StringInput from './StringInput';
import styles from '@/styles/components/FormController.module.scss';

const API_BASE = 'http://localhost:5000';

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            resolve(base64 ?? '');
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function FormController() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<string>('');
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    async function handleConvert() {
        setStatus(null);
        setAudioBlob(null);
        if (!pdfFile) {
            setStatus('Please select a PDF file.');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', pdfFile);
        formData.append('audioFile', audioFile);

        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/convertPDFToAudio`, {
                method: 'POST',
                body: formData,
            });

            const contentType = res.headers.get('content-type') ?? '';
            if (contentType.includes('audio/wav')) {
                const blob = await res.blob();
                setAudioBlob(blob);
                setStatus('Audio ready. Click Download to save.');
                setIsLoading(false);
                return;
            }

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setStatus(data.error || `Request failed (${res.status})`);
                return;
            }
            setStatus(data.message || 'Success.');
        } catch (err) {
            setStatus(err instanceof Error ? err.message : 'Request failed.');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDownload() {
        if (!audioBlob) return;
        const electron = require('electron');
        const ipcRenderer = electron.ipcRenderer;
        const base64 = await blobToBase64(audioBlob);
        const filename = audioFile.trim() ? audioFile : 'audio';
        const result = await ipcRenderer.invoke('save-audio-to-downloads', {
            data: base64,
            filename: filename.endsWith('.wav') ? filename : `${filename}.wav`,
        });
        if (result?.success) {
            setStatus(`Saved to ${result.path}`);
        } else {
            setStatus('Download failed.');
        }
    }

    return (
        <div className={styles.FormControllerContainer}>
            <FileInput label="PDF Input File" acceptType=".pdf,application/pdf" setFile={setPdfFile} />
            <StringInput label="Output File Name" value={audioFile} setValue={setAudioFile} />
            <AppButton label="Generate Audio" onClick={handleConvert} disabled={isLoading} />
            {isLoading && (
                <div className={styles.loadingWidget}>
                    <CircularProgress size={24} sx={{ color: '#fff' }} />
                    <span className={styles.loadingText}>Loading...</span>
                </div>
            )}
            {audioBlob != null && !isLoading && (
                <AppButton label="Download" onClick={handleDownload} />
            )}
            {status != null && !isLoading && <p className={styles.status}>{status}</p>}
        </div>
    );
}

export default FormController;