import bcrypt from 'bcryptjs';
bcrypt.compare('123456', '$2b$10$mJEwDN5PRXXZ2HUVRvv12.eEXvXrQnFsAuFnOR6MXa6jRAPifhZUK').then(r => console.log('Match?', r));
