const express = require('express');
const minioClient = require('./minio');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    await minioClient.fPutObject('devtest', file.originalname, file.path);
    fs.unlinkSync(file.path); // Удаляем временный файл
    res.send('File uploaded successfully.');
  } catch (err) {
    res.status(500).send('Error uploading file: ' + err.message);
  }
});

app.get('/files', async (req, res) => {
  try {
    const objects = await minioClient.listObjects('devtest', '', true);
    const files = [];
    console.log('llllXXXXXXXXXXX 66666');
    
    for await (const obj of objects) {
      files.push(obj.name);
    }
    res.json(files);
  } catch (err) {
    res.status(500).send('Error listing files: ' + err.message);
  }
});

app.get('/download/:filename', async (req, res) => {
  const filename = decodeURIComponent(req.params.filename); // Декодируем имя файла
  try {
    const fileStream = await minioClient.getObject('devtest', filename);
    const encodedFilename = encodeURIComponent(filename); // Кодируем имя файла
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"`);
    fileStream.pipe(res);
  } catch (err) {
    console.error('Error downloading file:', err); // Логируем ошибку
    res.status(500).send('Error downloading file: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});