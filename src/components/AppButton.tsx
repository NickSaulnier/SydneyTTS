import { Button } from '@mui/material';

type AppButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

function AppButton({ label, onClick, disabled = false }: AppButtonProps) {
  return (
    <Button variant="contained" color="error" fullWidth onClick={onClick} disabled={disabled}>
      {label}
    </Button>
  );
}

export default AppButton;
