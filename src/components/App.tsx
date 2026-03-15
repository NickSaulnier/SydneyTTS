// @ts-nocheck - avoids TS2590 from complex JSX types
import { Box, Card, Typography } from '@mui/material';
import { CubeScene } from './CubeScene';
import FormController from './FormController';
import styles from '@/styles/components/App.module.scss';

function App() {
  return (
    <Box className={styles.root}>
      <Box className={styles.canvasWrapper}>
        <CubeScene />
      </Box>
      <Card className={styles.card}>
        <Typography variant="h2" component="h1" className={styles.title} gutterBottom>
          Sydney TTS
        </Typography>
        <FormController />
      </Card>
    </Box>
  );
}

export default App;
