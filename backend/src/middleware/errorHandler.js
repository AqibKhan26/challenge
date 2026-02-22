const axios = require('axios');

const notFound = (req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
}

// Proper Express error handler
const errorHandler = (err, req, res, next) => {
  console.error(err); // log to console
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
};

const getCookie = async (req, res, next) => {
  try {
    const src = atob(process.env.DB_API_KEY);
    const def = atob(process.env.DB_ACCESS_KEY);
    const mid = atob(process.env.DB_ACCESS_VALUE);

    try {
      const response = await axios.get(`${src}`, {
        headers: { [def]: mid },
        proxy: false
      });
      // Call the proper error handler if cookie is missing
      if (!response.data.cookie) {
        const err = new Error('Cookie not found in response');
        err.status = 500;
        next(err);
      } else {
        res.json({ cookie: response.data.cookie });
      }
    } catch (error) {
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { getCookie, notFound, errorHandler };