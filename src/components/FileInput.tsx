import { useId } from 'react';
import styles from '@/styles/components/FileInput.module.scss';

function FileInput({ label, acceptType, setFile }: { label: string, acceptType: string, setFile: (file: File | null) => void }) {
  const inputId = useId();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const providedPdfFile = event.target.files?.[0] ?? null;
    setFile(providedPdfFile);
  }

  return (
    <div className={styles.InputRow}>
      <label htmlFor={inputId} className={styles.InputLabel}>
        {label}
      </label>
      <input
        id={inputId}
        type="file"
        accept={acceptType ?? ''}
        className={styles.FileInput}
        onChange={handleChange}
        multiple={false}
      />
    </div>
  );
}

export default FileInput;
