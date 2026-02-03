import express from 'express';
import { getApplications, updateApplication, createApplication, deleteApplication } from './application.repository.js'
import { requireAuth } from '../../middleware/requireAuth.js';

const router = express.Router();

// GET MANY
router.get('/', requireAuth, async (req, res) => {
    try {
        const getApplicationResult = await getApplications(req.user.userId);

        return getApplicationResult.success
            ? res.json(getApplicationResult.data)
            : res.sendStatus(getApplicationResult.status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// UPDATE ONE
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updateApplicationResult = await updateApplication(req.user.userId, id, req.body);

        return updateApplicationResult.success
            ? res.json(updateApplicationResult.data)
            : res.sendStatus(updateApplicationResult.status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// CREATE ONE
router.post('/', requireAuth, async (req, res) => {
    try {
        const createApplicationResult = await createApplication(req.user.userId, req.body);

        return createApplicationResult.success
            ? res.json(createApplicationResult.data)
            : res.sendStatus(createApplicationResult.status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// DELETE ONE
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const deleteApplicationResult = await deleteApplication(req.user.userId, id);

        return deleteApplicationResult.success
            ? res.json(deleteApplicationResult.data)
            : res.sendStatus(deleteApplicationResult.status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

export default router;