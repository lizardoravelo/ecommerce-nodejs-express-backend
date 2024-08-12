// Helper function for sending error responses
const handleErrorResponse = (res, err) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = handleErrorResponse;
