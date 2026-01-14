const express = require('express')
const repository = require('./application.repository')
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const applications = await repository.getApplications();
    res.json({applications});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.put('/:id', async (req, res) => {
  try{
    const { id } = req.params;

    const result_id = await repository.updateApplication(id, req.body);

    if (result_id?.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({applicationId: result_id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.post('/', async (req, res) => {
  try{
    const result_id = await repository.createApplication(req.body);

    if (result_id?.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({applicationId: result_id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.delete('/:id', async (req, res) => {
  try{
    const { id } = req.params;

    const result_id = await repository.deleteApplication(id);

    if (result_id?.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({applicationId: result_id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


module.exports = router;