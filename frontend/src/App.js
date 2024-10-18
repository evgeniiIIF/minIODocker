import React, { useState, useEffect } from 'react';
import api from './api';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [filesList, setFilesList] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData);
      setMessage(response.data);
      fetchFiles(); // Обновляем список файлов после загрузки
    } catch (err) {
      setMessage('Error uploading file: ' + err.message);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await api.get('/files');
      setFilesList(response.data);
    } catch (err) {
      setMessage('Error fetching files: ' + err.message);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await api.get(`/download/${filename}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setMessage('Error downloading file: ' + err.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Загрузка файлов22</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Загрузить</button>
      <p>{message}</p>
    <hr/>
      <h2>Список файлов</h2>
      <ul>
        {filesList.map((filename) => (
          <li key={filename}>
            {filename} <button onClick={() => handleDownload(filename)}>Скачать</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;