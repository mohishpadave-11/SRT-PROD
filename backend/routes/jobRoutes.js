const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import ALL controller functions
const { 
  createJob, 
  getJobs, 
  getJobById, // 👈 New
  updateJob,  // 👈 New
  deleteJob   // 👈 New
} = require('../controllers/jobController');

// --- Routes ---

// 1. Create a Job (POST /api/jobs)
router.post('/', protect, createJob);

// 2. Get All Jobs (GET /api/jobs)
router.get('/', protect, getJobs);

// 3. Get Single Job by ID (GET /api/jobs/:id)
router.get('/:id', protect, getJobById);

// 4. Update Job (PUT /api/jobs/:id)
router.put('/:id', protect, updateJob);

// 5. Delete Job (DELETE /api/jobs/:id)
router.delete('/:id', protect, deleteJob);

module.exports = router;