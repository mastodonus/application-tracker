const express = require('express')
const multer = require('multer');
const repository = require('./document.repository')

// Memory storage keeps files in RAM
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.get('/:documentId', async (req, res) => {
  try {
    console.log('downloading document...');
    const { documentId } = req.params;
    const document = await repository.getDocument(documentId);

    console.log(document);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.setHeader('Content-Type', document.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${document.filename}"`
    );
    res.setHeader('Content-Length', document.fileSize);

    res.send(document.content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { applicationId } = req.query;

    if (!applicationId) {
      return res.status(400).json({ error: 'applicationId is required' });
    }

    const documents = await repository.getDocumentHeaders(null, applicationId);
    res.json({documents});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', upload.single('document'), async (req, res) => {
  try{
    const { applicationId } = req.body;
    const file = req.file;

    const documentId = await repository.createDocument({
      applicationId,
      filename: file.originalname,
      contentType: file.mimetype,
      fileSize: file.size,
      content: file.buffer
    });

    if (documentId?.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({documentId});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/:documentId', async (req, res) => {
  try{
    const { documentId } = req.params;

    const result_id = await repository.deleteDocument(documentId);

    if (result_id?.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({documentId: result_id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;