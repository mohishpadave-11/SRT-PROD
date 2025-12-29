const { Company } = require('../models');
const { Op } = require('sequelize'); 
const { sendSuccess, sendError } = require('../utils/responseHelper'); 

// @desc    Add a New Company
// @route   POST /api/companies
exports.createCompany = async (req, res) => {
  try {
    const { name, address, type } = req.body;
    
    // Production-grade name validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return sendError(res, 'Company name is required and cannot be empty', 400);
    }
    
    // Sanitize name by trimming whitespace
    const sanitizedName = name.trim();
    
    // Additional validation for name length and characters
    if (sanitizedName.length < 2) {
      return sendError(res, 'Company name must be at least 2 characters long', 400);
    }
    
    if (sanitizedName.length > 100) {
      return sendError(res, 'Company name cannot exceed 100 characters', 400);
    }
    
    const companyType = type || 'Both';

    // Check for duplicates by name only (using sanitized name)
    const exists = await Company.findOne({ 
      where: { 
        name: sanitizedName
      } 
    });

    if (exists) {
      return sendError(res, `Company '${sanitizedName}' already exists`, 400);
    }

    const company = await Company.create({
      name: sanitizedName,
      address,
      type: companyType,
      createdBy: req.user.id
    });

    return sendSuccess(res, 'Company created successfully', company, 201);
  } catch (error) {
    console.error("Error creating company:", error); 
    return sendError(res, 'Could not create company', 500);
  }
};

// @desc    Get All Companies
// @route   GET /api/companies
exports.getCompanies = async (req, res) => {
  try {
    const { type } = req.query;
    
    let whereClause = {};

    // Production-grade filtering logic
    if (type) {
      // Validate type parameter
      const validTypes = ['Exporter', 'Consignee', 'Both'];
      if (!validTypes.includes(type)) {
        return sendError(res, `Invalid company type. Must be one of: ${validTypes.join(', ')}`, 400);
      }

      // Smart filtering logic:
      // - If requesting 'Exporter': return companies that are 'Exporter' OR 'Both'
      // - If requesting 'Consignee': return companies that are 'Consignee' OR 'Both'  
      // - If requesting 'Both': return only companies that are 'Both'
      if (type === 'Exporter') {
        whereClause = {
          type: { [Op.in]: ['Exporter', 'Both'] }
        };
      } else if (type === 'Consignee') {
        whereClause = {
          type: { [Op.in]: ['Consignee', 'Both'] }
        };
      } else if (type === 'Both') {
        whereClause = {
          type: 'Both'
        };
      }
    }
    // If no type specified, return all companies

    const companies = await Company.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });

    return sendSuccess(res, 'Companies fetched successfully', companies);
  } catch (error) {
    console.error("❌ DB ERROR:", error); 
    return sendError(res, 'Could not fetch companies', 500);
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
      return sendSuccess(res, 'Company updated successfully', updatedCompany);
    }
    
    return sendError(res, 'Company not found', 404);
  } catch (error) {
    console.error("Error updating company:", error);
    return sendError(res, 'Could not update company', 500);
  }
};

// @desc    Delete Company
// @route   DELETE /api/companies/:id
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Company.destroy({ where: { id } });
    
    if (deleted) {
      return sendSuccess(res, 'Company deleted successfully', null);
    }
    
    return sendError(res, 'Company not found', 404);
  } catch (error) {
    console.error("Error deleting company:", error);
    return sendError(res, 'Could not delete company', 500);
  }
};