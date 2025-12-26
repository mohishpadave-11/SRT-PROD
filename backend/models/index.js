const sequelize = require('../config/database');
const User = require('./User');
const Company = require('./Company');
const Job = require('./Job');
const Document = require('./Document'); // 👈 1. Import Document

// --- Define Relationships ---

// 1. User & Company (Who created the company)
User.hasMany(Company, { foreignKey: 'createdBy' });
Company.belongsTo(User, { foreignKey: 'createdBy' });

// 2. User & Job (Who created the job)
User.hasMany(Job, { foreignKey: 'createdBy' });
Job.belongsTo(User, { foreignKey: 'createdBy' });

// 3. Job & Document (Documents belong to a specific Job)
// onDelete: 'CASCADE' means if you delete a Job, all its documents are deleted from DB automatically
Job.hasMany(Document, { foreignKey: 'job_id', onDelete: 'CASCADE' });
Document.belongsTo(Job, { foreignKey: 'job_id' });

// 4. User & Document (Who uploaded the file)
User.hasMany(Document, { foreignKey: 'uploaded_by' });
Document.belongsTo(User, { foreignKey: 'uploaded_by' });

module.exports = {
  sequelize,
  User,
  Company,
  Job,
  Document // 👈 5. Export Document
};