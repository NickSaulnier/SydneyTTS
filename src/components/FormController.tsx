import { useState } from 'react';
import AppButton from './AppButton';
import FileInput from './FileInput';
import StringInput from './StringInput';
import styles from '@/styles/components/FormController.module.scss';

function FormController() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<string>('');
    const [voice, setVoice] = useState<string>('');

    return (
        <div className={styles.FormControllerContainer}>
            <FileInput label="PDF Input File" acceptType=".pdf,application/pdf" setFile={setPdfFile} />
            <StringInput label="Output File Name" value={audioFile} setValue={setAudioFile} />
            <AppButton label="Generate Audio" onClick={() => {}} />
        </div>
    );
}

export default FormController;