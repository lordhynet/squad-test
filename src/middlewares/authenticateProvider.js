const authenticateProvider = (req, res, next) => {
    const apiKey = req.headers['authorization']?.split(' ')[1]; // Extract API key from Authorization header
  
    if (!apiKey || apiKey !== process.env.SECRET_API_KEY) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
  
    next(); // Proceed if authenticated
  };
  
  module.exports = authenticateProvider;
  