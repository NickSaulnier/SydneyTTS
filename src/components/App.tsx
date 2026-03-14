import { Box, Card, Typography } from '@mui/material';
import styles from '@/styles/components/App.module.scss';

function App() {
  return (
    <Box className={styles.root}>
      <Card className={styles.card}>
        <Typography variant="h4" component="h1" className={styles.title} gutterBottom>
          Sydney TTS
        </Typography>
        <Typography variant="body1" className={styles.subtitle}>
          PDF to Audio — Convert your documents to speech.
        </Typography>
      </Card>
    </Box>
  );
}

export default App;
