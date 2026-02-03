import express from 'express';
import multer from 'multer';
import { getDocument, getDocumentHeaders, createDocument, deleteDocument } from './document.repository.js'
import { requireAuth } from '../../middleware/requireAuth.js';

// Memory storage keeps files in RAM
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

// GET ONE
router.get('/:documentId', requireAuth, async (req, res) => {
    try {
        const { documentId } = req.params;
        const getDocumentResult = await getDocument(req.user.userId, documentId);
        if(!getDocumentResult.success){
            return res.sendStatus(getDocumentResult.status);
        }

        res.setHeader('Content-Type', getDocumentResult.data.contentType);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${getDocumentResult.data.filename}"`
        );
        res.setHeader('Content-Length', getDocumentResult.data.fileSize);
        res.send(getDocumentResult.data.content);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// GET MANY
router.get('/', requireAuth, async (req, res) => {
    try {
        const { applicationId } = req.query;
        const getDocumentHeadersResult = await getDocumentHeaders(req.user.userId, applicationId);

        return getDocumentHeadersResult.success
            ? res.json(getDocumentHeadersResult.data)
            : res.sendStatus(getDocumentHeadersResult.status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// CREATE ONE
router.post('/', requireAuth, upload.single('document'), async (req, res) => {
    try {
        const { applicationId } = req.body;
        const file = req.file;

        const createDocumentResult = await createDocument(req.user.userId, {
            applicationId,
            filename: file.originalname,
            contentType: file.mimetype,
            fileSize: file.size,
            content: file.buffer
        });

        return createDocumentResult.success
            ? res.json(createDocumentResult.data)
            : res.sendStatus(createDocumentResult.status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// DELETE ONE
router.delete('/:documentId', requireAuth, async (req, res) => {
    try {
        const { documentId } = req.params;
        const deleteDocumentResult = await deleteDocument(req.user.userId, documentId);

        return deleteDocumentResult.success
            ? res.json(deleteDocumentResult.data)
            : res.sendStatus(deleteDocumentResult.status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

export default router;