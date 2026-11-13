// Script to download face-api.js models
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODELS_DIR = path.join(__dirname, 'public', 'models');
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

const models = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

console.log('Downloading face-api.js models...\n');

let downloaded = 0;

models.forEach((model) => {
  const url = `${BASE_URL}/${model}`;
  const filePath = path.join(MODELS_DIR, model);

  https.get(url, (response) => {
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      downloaded++;
      console.log(`✓ Downloaded: ${model}`);

      if (downloaded === models.length) {
        console.log('\n✅ All models downloaded successfully!');
      }
    });
  }).on('error', (err) => {
    console.error(`✗ Error downloading ${model}:`, err.message);
  });
});
