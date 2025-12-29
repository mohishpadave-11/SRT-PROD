const { Job, Document, Company, User } = require('../models');
const { Op } = require('sequelize');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// @desc    Get Dashboard Data
// @route   GET /api/dashboard/data
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    
    // Build date filter if year/month provided
    let dateFilter = {};
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      dateFilter = {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      dateFilter = {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      };
    }

    // Get total counts
    const totalJobs = await Job.count({ where: dateFilter });
    const totalDocuments = await Document.count({ where: dateFilter });
    const totalCompanies = await Company.count();

    // Get jobs by status
    const jobsByStatus = await Job.findAll({
      where: dateFilter,
      attributes: [
        'status',
        [Job.sequelize.fn('COUNT', Job.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get recent jobs (last 10)
    const recentJobs = await Job.findAll({
      where: dateFilter,
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['name']
      }]
    });

    // Get monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrends = await Job.findAll({
      where: {
        createdAt: {
          [Op.gte]: sixMonthsAgo
        }
      },
      attributes: [
        [Job.sequelize.fn('DATE_TRUNC', 'month', Job.sequelize.col('createdAt')), 'month'],
        [Job.sequelize.fn('COUNT', Job.sequelize.col('id')), 'count']
      ],
      group: [Job.sequelize.fn('DATE_TRUNC', 'month', Job.sequelize.col('createdAt'))],
      order: [[Job.sequelize.fn('DATE_TRUNC', 'month', Job.sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    // Format response data
    const dashboardData = {
      summary: {
        totalJobs,
        totalDocuments,
        totalCompanies,
        period: year && month ? `${year}-${month.toString().padStart(2, '0')}` : year || 'all-time'
      },
      jobsByStatus: jobsByStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      recentJobs: recentJobs.map(job => ({
        id: job.id,
        job_number: job.job_number,
        status: job.status,
        port_of_loading: job.port_of_loading,
        port_of_discharge: job.port_of_discharge,
        createdAt: job.createdAt,
        createdBy: job.User?.name || 'Unknown'
      })),
      monthlyTrends: monthlyTrends.map(trend => ({
        month: trend.month,
        count: parseInt(trend.count)
      }))
    };

    return sendSuccess(res, 'Dashboard data fetched successfully', dashboardData);
  } catch (error) {
    console.error('Dashboard data error:', error);
    return sendError(res, 'Could not fetch dashboard data', 500);
  }
};