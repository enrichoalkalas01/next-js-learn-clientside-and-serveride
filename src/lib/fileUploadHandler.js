// lib/fileUploadHandlers.js
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

const parseForm = async (req) => {
    const form = formidable({ multiples: true });
    const [fields, files] = await form.parse(req);
    const file = files.file[0];

    if (!file || !file.filepath) {
        throw new Error('No file uploaded');
    }

    return { file, fields };
};

const createUploadDir = async (uploadDir) => {
    await fs.mkdir(uploadDir, { recursive: true });
};

const generateUniqueFilename = (file) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.mimetype.split('/')[1];
    return `${uniqueSuffix}.${fileExtension}`;
};

const moveFile = async (oldPath, newPath) => {
    await fs.rename(oldPath, newPath);
    return newPath;
};

export const handleImageUpload = async (req, res, uploadDir) => {
    try {
        const { file } = await parseForm(req);
        if (!file.mimetype.startsWith('image/')) {
            return res.status(400).json({ error: 'Invalid file type' });
        }

        await createUploadDir(uploadDir);
        const newFilename = generateUniqueFilename(file);
        const newFilepath = path.join(uploadDir, newFilename);

        await moveFile(file.filepath, newFilepath);

        return res.status(200).json({ message: 'Image uploaded successfully', imageUrl: `/uploads/${newFilename}` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const handleVideoUpload = async (req, res, uploadDir) => {
    try {
        const { file } = await parseForm(req);
        if (!file.mimetype.startsWith('video/')) {
            return res.status(400).json({ error: 'Invalid file type' });
        }

        await createUploadDir(uploadDir);
        const newFilename = generateUniqueFilename(file);
        const newFilepath = path.join(uploadDir, newFilename);

        await moveFile(file.filepath, newFilepath);

        return res.status(200).json({ message: 'Video uploaded successfully', videoUrl: `/uploads/${newFilename}` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const handleDocUpload = async (req, res, uploadDir) => {
    try {
        const { file } = await parseForm(req);
        if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
            return res.status(400).json({ error: 'Invalid file type' });
        }

        await createUploadDir(uploadDir);
        const newFilename = generateUniqueFilename(file);
        const newFilepath = path.join(uploadDir, newFilename);

        await moveFile(file.filepath, newFilepath);

        return res.status(200).json({ message: 'Document uploaded successfully', docUrl: `/uploads/${newFilename}` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const handleOtherFileUpload = async (req, res, uploadDir) => {
    try {
        const { file } = await parseForm(req);

        await createUploadDir(uploadDir);
        const newFilename = generateUniqueFilename(file);
        const newFilepath = path.join(uploadDir, newFilename);

        await moveFile(file.filepath, newFilepath);

        return res.status(200).json({ message: 'File uploaded successfully', fileUrl: `/uploads/${newFilename}` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
