import express from 'express';
import { getInterview, getInterviews, updateInterview, createInterview, deleteInterview } from './interview.repository.js'
import { requireAuth } from '../../middleware/requireAuth.js';

const router = express.Router();

// GET ONE
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.query;
        const getInterviewResult = await getInterview(req.user.userId, id);
        
        return getInterviewResult.success
            ? res.json(getInterviewResult.data)
            : res.sendStatus(getInterviewResult.status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// GET MANY
router.get('/', requireAuth, async (req, res) => {
    try {
        const { applicationId } = req.query;
        const getInterviewsResult = await getInterviews(req.user.userId, applicationId);
        
        return getInterviewsResult.success
            ? res.json(getInterviewsResult.data)
            : res.sendStatus(getInterviewsResult.status);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
});

// UPDATE ONE
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updateInterviewResult = await updateInterview(req.user.userId, id, req.body);

        return updateInterviewResult.success
            ? res.json(updateInterviewResult.data)
            : res.sendStatus(updateInterviewResult.status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// CREATE ONE
router.post('/', requireAuth, async (req, res) => {
    try {
        const createInterviewResult = await createInterview(req.user.userId, req.body);

        return createInterviewResult.success
            ? res.json(createInterviewResult.data)
            : res.sendStatus(createInterviewResult.status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// DELETE ONE
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const deleteInterviewResult = await deleteInterview(req.user.userId, id);

        return deleteInterviewResult.success
            ? res.json(deleteInterviewResult.data)
            : res.sendStatus(deleteInterviewResult.status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

export default router;