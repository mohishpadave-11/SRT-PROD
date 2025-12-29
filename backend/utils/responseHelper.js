const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

const sendError = (res, message, statusCode = 500, data = null) => {
  return sendResponse(res, statusCode, false, message, data);
};

module.exports = { sendSuccess, sendError, sendResponse };