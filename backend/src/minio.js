const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: 'minio',
  port: 9000,
  useSSL: false,
  accessKey: 'admin',
  secretKey: 'minio-secret-key',
});

module.exports = minioClient;