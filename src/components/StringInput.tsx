import { useId } from 'react';
import styles from '@/styles/components/StringInput.module.scss';

type StringInputProps = {
  label: string;
  value: string;
  setValue: (value: string) => void;
}

function StringInput({ label, value, setValue }: StringInputProps) {
  const inputId = useId();

  return (
    <div className={styles.inputRow}>
      <label htmlFor={inputId} className={styles.inputLabel}>
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        className={styles.textInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export default StringInput;
