const express = require('express')
const repository = require('./interview.repository')
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const interviews = await repository.getInterviews();
    res.json({interviews});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.put('/:id', async (req, res) => {
  try{
    const { id } = req.params;

    const result_id = await repository.updateInterview(id, req.body);

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
    const result_id = await repository.createInterview(req.body);

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

    const result_id = await repository.deleteInterview(id);

    if (result_id?.length === 0) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json({interviewId: result_id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


module.exports = router;