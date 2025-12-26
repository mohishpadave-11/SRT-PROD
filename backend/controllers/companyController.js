const { Company } = require('../models');
const { Op } = require('sequelize'); 

// @desc    Add a New Company
// @route   POST /api/companies
exports.createCompany = async (req, res) => {
  try {
    const { name, address, type } = req.body;
    
    const companyType = type || 'Both';

    // Check for duplicates by name only (since we now have one list)
    const exists = await Company.findOne({ 
      where: { 
        name: name
      } 
    });

    if (exists) {
      return res.status(400).json({ 
        message: `Company '${name}' already exists.` 
      });
    }

    const company = await Company.create({
      name,
      address,
      type: companyType,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    console.error("Error creating company:", error); 
    res.status(500).json({ message: 'Server Error: Could not create company' });
  }
};

// @desc    Get All Companies
// @route   GET /api/companies
exports.getCompanies = async (req, res) => {
  try {
    const { type } = req.query;
    
    // Debug log to confirm what the frontend is asking for
    // console.log(`🔍 API HIT: Searching for companies with type: '${type}'`); 

    let whereClause = {};

    // Filter Logic:
    // If frontend asks for 'Exporter' or 'Consignee', we return 'Both' type companies
    if (type) {
      whereClause = {
        type: 'Both'
      };
    }

    const companies = await Company.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });

    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    console.error("❌ DB ERROR:", error); 
    res.status(500).json({ message: 'Server Error: Could not fetch companies' });
  }
};

// @desc    Update Company
// @route   PUT /api/companies/:id
exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Company.update(req.body, { where: { id } });
    
    if (updated) {
      const updatedCompany = await Company.findOne({ where: { id } });
      return res.status(200).json({ success: true, data: updatedCompany });
    }
    
    res.status(404).json({ message: 'Company not found' });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Company
// @route   DELETE /api/companies/:id
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await Company.destroy({ where: { id } });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ message: error.message });
  }
};