const { Job, User } = require('../models');
const { ValidationError, NotFoundError, ConflictError } = require('../utils/customErrors');
const { sanitizeTextInput } = require('../utils/fileSanitization');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// @desc    Create a new Job
// @route   POST /api/jobs
// @access  Private (Admin/SuperAdmin)
exports.createJob = async (req, res, next) => {
  try {
    // 1. Get ALL data from the frontend
    const { 
      // --- New Fields ---
      job_date,
      exporter_name,
      exporter_address,
      consignee_name,
      consignee_address,
      notify_party,
      final_destination,
      
      // --- Existing Fields ---
      job_number, 
      port_of_loading, 
      port_of_discharge, 
      service_type, 
      shipment_type, 
      transport_mode, 
      volume, 
      container_no, 
      eta, 
      delivered_date, 
      invoice_no, 
      invoice_date, 
      bill_of_entry_no, 
      bl_no, 
      sob_date, 
      bl_date, 
      bill_of_entry_date, 
      shipping_bill_no, 
      vessel_flight_type, 
      vessel_flight_name,
      status
    } = req.body;

    // Validate required fields
    if (!job_number) {
      throw new ValidationError('Job number is required');
    }

    // Sanitize text inputs to prevent XSS
    const sanitizedData = {
      job_number: sanitizeTextInput(job_number),
      exporter_name: sanitizeTextInput(exporter_name),
      exporter_address: sanitizeTextInput(exporter_address),
      consignee_name: sanitizeTextInput(consignee_name),
      consignee_address: sanitizeTextInput(consignee_address),
      notify_party: sanitizeTextInput(notify_party),
      final_destination: sanitizeTextInput(final_destination),
      port_of_loading: sanitizeTextInput(port_of_loading),
      port_of_discharge: sanitizeTextInput(port_of_discharge),
      service_type: sanitizeTextInput(service_type),
      shipment_type: sanitizeTextInput(shipment_type),
      transport_mode: sanitizeTextInput(transport_mode),
      volume: sanitizeTextInput(volume),
      container_no: sanitizeTextInput(container_no),
      invoice_no: sanitizeTextInput(invoice_no),
      bl_no: sanitizeTextInput(bl_no),
      bill_of_entry_no: sanitizeTextInput(bill_of_entry_no),
      shipping_bill_no: sanitizeTextInput(shipping_bill_no),
      vessel_flight_type: sanitizeTextInput(vessel_flight_type),
      vessel_flight_name: sanitizeTextInput(vessel_flight_name),
      status: sanitizeTextInput(status)
    };

    // 2. Check if job number already exists (must be unique)
    const jobExists = await Job.findOne({ where: { job_number: sanitizedData.job_number } });
    if (jobExists) {
      throw new ConflictError('Job Number already exists');
    }

    // 3. Create the Job in the database
    const job = await Job.create({
      // --- New Fields ---
      job_date: job_date || new Date(), // Default to today if empty
      exporter_name: sanitizedData.exporter_name,
      exporter_address: sanitizedData.exporter_address,
      consignee_name: sanitizedData.consignee_name,
      consignee_address: sanitizedData.consignee_address,
      notify_party: sanitizedData.notify_party,
      final_destination: sanitizedData.final_destination,

      // --- Existing Fields ---
      job_number: sanitizedData.job_number,
      port_of_loading: sanitizedData.port_of_loading,
      port_of_discharge: sanitizedData.port_of_discharge,
      service_type: sanitizedData.service_type,
      shipment_type: sanitizedData.shipment_type,
      transport_mode: sanitizedData.transport_mode,
      volume: sanitizedData.volume,
      container_no: sanitizedData.container_no,
      eta,
      delivered_date,
      invoice_no: sanitizedData.invoice_no,
      invoice_date,
      bill_of_entry_no: sanitizedData.bill_of_entry_no,
      bl_no: sanitizedData.bl_no,
      sob_date,
      bl_date,
      bill_of_entry_date,
      shipping_bill_no: sanitizedData.shipping_bill_no,
      vessel_flight_type: sanitizedData.vessel_flight_type,
      vessel_flight_name: sanitizedData.vessel_flight_name,
      status: sanitizedData.status || 'Draft',
      createdBy: req.user.id // Grabs ID from the authenticated user middleware
    });

    return sendSuccess(res, 'Job created successfully', job, 201);

  } catch (error) {
    next(error);
  }
};

// @desc    Get All Jobs
// @route   GET /api/jobs
// @access  Private
exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({
      include: [{
        model: User,
        attributes: ['name', 'email'] // Show who created the job
      }],
      order: [['createdAt', 'DESC']] // Newest jobs first
    });

    return sendSuccess(res, 'Jobs fetched successfully', jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Job by ID
// @route   GET /api/jobs/:id
// @access  Private
exports.getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByPk(id, {
      include: [{
        model: User,
        attributes: ['name', 'email']
      }]
    });
    
    if (!job) {
      throw new NotFoundError('Job not found');
    }
    
    return sendSuccess(res, 'Job fetched successfully', job);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a Job
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 1. Find the job first
    const job = await Job.findByPk(id);
    if (!job) {
      throw new NotFoundError('Job not found');
    }
    
    // 2. Update the instance
    // Using instance.update() is better than Model.update() as it returns the updated object immediately
    const updatedJob = await job.update(req.body);
    
    return sendSuccess(res, 'Job updated successfully', updatedJob);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Job
// @route   DELETE /api/jobs/:id
// @access  Private
exports.deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 1. Find the job first (ensures hooks run if you have any)
    const job = await Job.findByPk(id);
    if (!job) {
      throw new NotFoundError('Job not found');
    }
    
    // 2. Destroy the record
    await job.destroy();
    
    return sendSuccess(res, 'Job deleted successfully', null);
  } catch (error) {
    next(error);
  }
};