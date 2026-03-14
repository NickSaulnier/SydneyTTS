import { Box, Container, Typography } from '@mui/material';
import styles from '@/styles/components/App.module.scss';

function App() {
  return (
    <Box className={styles.root}>
      <Container maxWidth="md" className={styles.container}>
        <Typography variant="h4" component="h1" className={styles.title} gutterBottom>
          Sydney TTS
        </Typography>
        <Typography variant="body1" color="text.secondary">
          PDF to Audio — Convert your documents to speech.
        </Typography>
      </Container>
    </Box>
  );
}

export default App;
