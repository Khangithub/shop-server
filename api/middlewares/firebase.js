const admin = require ('firebase-admin');
const uuid = require ('uuid-v4');

const config = require ('../../configs/firebase');
const serviceAccount = require ('../../configs/firebase/configKey.json');

const uploadFile = async ({filename, mimetype, path}, folderName) => {
  if (!admin.apps.length) {
    backendApp = admin.initializeApp ({
      credential: admin.credential.cert (serviceAccount),
      storageBucket: config.storageBucket,
    });
  }

  const metadata = {
    metadata: {
      firebaseStorageDownloadTokens: uuid (),
    },
    cacheControl: 'public, max-age=31536000',
  };

  await backendApp.storage ().bucket ().upload (path, {
    gzip: true,
    metadata,
    destination: `${folderName}/${filename}`,
  });

  return {
    filename: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${folderName}%2F${filename}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`,
    mimetype,
  };
};

module.exports = {
  uploadFile,
};
