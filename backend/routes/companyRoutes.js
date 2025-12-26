const express = require('express');
const router = express.Router();

// 👇 MAKE SURE ALL 4 FUNCTIONS ARE LISTED HERE 👇
const { 
  createCompany, 
  getCompanies, 
  updateCompany, // <--- This was likely missing!
  deleteCompany  // <--- This too!
} = require('../controllers/companyController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createCompany);
router.get('/', protect, getCompanies);
router.put('/:id', protect, updateCompany);
router.delete('/:id', protect, deleteCompany);

module.exports = router;