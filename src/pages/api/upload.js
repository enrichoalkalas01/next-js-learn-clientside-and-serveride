// pages/api/upload.js
import { NextApiRequest, NextApiResponse } from 'next'
import { handleFileUpload } from '../../lib/fileUploadHandler'
import path from 'path'

export const config = {
    api: {
        bodyParser: false,
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }
    
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    await handleFileUpload(req, res, uploadDir)
}
