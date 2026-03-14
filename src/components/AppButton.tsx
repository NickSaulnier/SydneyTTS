import { Button } from '@mui/material';

type AppButtonProps = {
  label: string;
  onClick: () => void;
};

function AppButton({ label, onClick }: AppButtonProps) {
  return (
    <Button variant="contained" color="error" fullWidth onClick={onClick}>
      {label}
    </Button>
  );
}

export default AppButton;
