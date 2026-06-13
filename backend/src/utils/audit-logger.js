const AuditLog = require('../models/audit-log.model');

const logAction = async (action, req, details = {}) => {
  try {
    await AuditLog.create({
      user: req?.user?.id || req?.user?._id,
      action,
      ip: req?.ip || req?.headers['x-forwarded-for'],
      details,
    });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
};

module.exports = { logAction };
