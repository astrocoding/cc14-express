const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Koneksi ke Google Cloud Storage
const storage = new Storage({
    keyFilename: path.join(__dirname, '../', process.env.GCLOUD_KEY_FILE),
    projectId: process.env.GCLOUD_PROJECT_ID
});

const bucketName = process.env.GCLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// Fungsi untuk upload gambar
exports.uploadImageToBucket = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No file uploaded');
        }

        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
            resumable: false
        });

        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
            resolve(publicUrl);
        }).on('error', (err) => {
            reject(`Unable to upload image, something went wrong: ${err}`);
        }).end(file.buffer);
    });
};
