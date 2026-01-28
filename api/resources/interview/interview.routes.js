import express from 'express';
import { getInterviews, updateInterview, createInterview, deleteInterview } from './interview.repository.js'

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const interviews = await getInterviews();
    res.json({interviews});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.put('/:id', async (req, res) => {
  try{
    const { id } = req.params;

    const result_id = await updateInterview(id, req.body);

    if (result_id?.length === 0) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json({interviewId: result_id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.post('/', async (req, res) => {
  try{
    const result_id = await createInterview(req.body);

    if (result_id?.length === 0) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json({interviewId: result_id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.delete('/:id', async (req, res) => {
  try{
    const { id } = req.params;

    const result_id = await deleteInterview(id);

    if (result_id?.length === 0) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json({interviewId: result_id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;