const { storageGC } = require('../app/cloudApp');
const { promisify } = require('util');
const fs = require('fs');
const multer = require('multer');
const { TypeFiles, FileExtension, ErrorType } = require('../lib/Constants');
const NotFoundError = require('../exceptions/NotFoundError');

const FileSize = parseInt(process.env.MAX_SIZE_FILE || 1048576);

let storage = multer.diskStorage({
    filename: (req, file, callback) => {
        if (file.mimetype === 'zip') file.mimetype = FileExtension.ZIP;
        if (file.mimetype === 'rar') file.mimetype = FileExtension.RAR;
        if (TypeFiles.indexOf(file.mimetype) === -1)
            return callback(file.originalname + ErrorType.FILE_INVALID, null);
        callback(
            null,
            `${Date.now()}-${FileExtension.NAME_FILE}-${file.originalname}`,
        );
    },
});

let validManyFiles = promisify(
    multer({
        storage,
        limits: { fileSize: FileSize * 10 },
    }).array('files', 10),
);
let validFile = promisify(
    multer({ storage, limits: { fileSize: FileSize } }).single('file'),
);

function getPublicUrl(bucketName, filename) {
    return encodeURI(
        `https://storage.googleapis.com/${bucketName}/${filename}`,
    );
}

function uploadToCloud(bucketName) {
    return (req, res, next) => {
        if (!req.file) next(new NotFoundError(ErrorType.FILE_NOT_FOUND));
        const bucket = storageGC.bucket(bucketName);
        const gcsname = req.file.filename;
        const file = bucket.file(gcsname);

        fs.createReadStream(req.file.path)
            .pipe(
                file.createWriteStream({
                    metadata: {
                        contentType: req.file.mimetype,
                    },
                    resumable: false,
                }),
            )
            .on('error', (err) => {
                next(err);
            })
            .on('finish', async () => {
                req.file.publicUrl = getPublicUrl(bucketName, gcsname);
                next();
            });
    };
}

function uploadFileToCloud(bucketName, file) {
    if (!file) throw new NotFoundError(ErrorType.FILE_NOT_FOUND);
    const bucket = storageGC.bucket(bucketName);
    const gcsname = file.filename;
    const fileStream = bucket.file(gcsname);

    return new Promise((resolve, reject) => {
        fs.createReadStream(file.path)
            .pipe(
                fileStream.createWriteStream({
                    metadata: {
                        contentType: file.mimetype,
                    },
                    resumable: false,
                }),
            )
            .on('error', (err) => {
                reject(err);
            })
            .on('finish', () => {
                resolve(getPublicUrl(bucketName, gcsname));
            });
    });
}

async function deleteFile(bucketName, fileName) {
    if (!fileName || fileName === '') return;
    const bucket = storageGC.bucket(bucketName);
    await bucket.file(fileName).delete();
}

function uploadToCloudBase64(bucketName) {
    return (req, res, next) => {
        const fileInfo = req.body;
        validatePhotoBase64(fileInfo);
        req.file = {};

        const { fileOrigin, fileBase64 } = fileInfo;
        var fileExtension = fileOrigin.split('.').pop();

        const bucket = storageGC.bucket(bucketName);
        const gcsname = `${Date.now()}-${
            FileExtension.NAME_FILE
        }-${fileOrigin}`;

        const file = bucket.file(gcsname);
        const fileBuffer = Buffer.from(fileBase64, 'base64');
        const contentType = convertFileExtensionToContentType(fileExtension);

        file.save(fileBuffer, {
            metadata: {
                contentType,
            },
            resumable: false,
            validation: 'md5',
        })
            .then(() => {
                req.file.filename = gcsname;
                req.file.publicUrl = getPublicUrl(bucketName, gcsname);
                next();
            })
            .catch((err) => {
                next(err);
            });
    };
}

function validatePhotoBase64(fileInfo) {
    const { fileOrigin, fileBase64 } = fileInfo;

    if (!fileOrigin || !fileBase64)
        throw new Error(ErrorType.FILE_BASE64_INVALID);

    const fileExtension = fileOrigin.split('.').pop();
    if (['png', 'jpg', 'jpeg', 'gif'].indexOf(fileExtension) === -1)
        throw new Error(ErrorType.AVATAR_INVALID);
}

function convertFileExtensionToContentType(fileExtension) {
    switch (fileExtension) {
        case 'png':
            return 'image/png';
        case 'jpg':
            return 'image/jpeg';
        case 'jpeg':
            return 'image/jpeg';
        case 'mp3':
            return 'audio/mpeg';
        case 'mp4':
            return 'video/mp4';
        default:
            throw new Error(ErrorType.FILE_INVALID);
    }
    // if (fileExtension === '.png') return 'image/png';
    // if (fileExtension === '.jpg' || fileExtension === '.jpeg') return 'image/jpeg';
    // if (fileExtension === '.mp3') return 'video/mp3';
    // if (fileExtension === '.mp4') return 'video/mp4';
}

module.exports = {
    validManyFiles,
    validFile,
    uploadToCloud,
    uploadFileToCloud,
    deleteFile,
    uploadToCloudBase64,
};
