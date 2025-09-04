var express = require('express');
var router = express.Router();
var Users = require('../models/users');

// Mock JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Simple password hashing (in production, use bcrypt)
function hashPassword(password) {
  // This is a simple hash for demo purposes
  // In production, use bcrypt.hashSync(password, 10)
  return Buffer.from(password).toString('base64');
}

// Simple password verification (in production, use bcrypt)
function verifyPassword(password, hashedPassword) {
  // This is a simple verification for demo purposes
  // In production, use bcrypt.compareSync(password, hashedPassword)
  return hashPassword(password) === hashedPassword;
}

// Simple JWT token generation (in production, use jsonwebtoken)
function generateToken(user) {
  // This is a mock token for demo purposes
  // In production, use jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Simple JWT token verification (in production, use jsonwebtoken)
function verifyToken(token) {
  try {
    // This is a mock verification for demo purposes
    // In production, use jwt.verify(token, JWT_SECRET)
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload;
  } catch (error) {
    return null;
  }
}

// POST /auth/register - User registration
router.post('/register', function(req, res, next) {
  const { username, email, password } = req.body;
  
  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ 
      error: 'Missing required fields: username, email, password' 
    });
  }
  
  // Check if user already exists
  Users.findOne({ where: { username } }).then((existingUser) => {
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Username already exists' 
      });
    }
    
    // Check if email already exists
    return Users.findOne({ where: { email } });
  }).then((existingEmail) => {
    if (existingEmail) {
      return res.status(409).json({ 
        error: 'Email already exists' 
      });
    }
    
    // Create new user
    const userData = {
      username,
      email,
      password: hashPassword(password) // Hash the password
    };
    
    return Users.create(userData);
  }).then((user) => {
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data and token (exclude password)
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    res.status(201).json({
      user: userResponse,
      token: token
    });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// POST /auth/login - User login
router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  
  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Missing required fields: username, password' 
    });
  }
  
  // Find user by username
  Users.findOne({ where: { username } }).then((user) => {
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid username or password' 
      });
    }
    
    // Verify password
    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ 
        error: 'Invalid username or password' 
      });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data and token (exclude password)
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    res.json({
      user: userResponse,
      token: token
    });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// POST /auth/logout - User logout
router.post('/logout', function(req, res, next) {
  // In a real application, you might want to:
  // 1. Add token to a blacklist
  // 2. Remove token from client storage
  // 3. Log the logout event
  
  // For now, just return success
  res.json({ 
    message: 'Logged out successfully' 
  });
});

// GET /auth/me - Get current user info (protected route)
router.get('/me', function(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      error: 'No token provided' 
    });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      error: 'Invalid token' 
    });
  }
  
  // Find user by ID
  Users.findByPk(decoded.id).then((user) => {
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found' 
      });
    }
    
    // Return user data (exclude password)
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    res.json({ user: userResponse });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

module.exports = router;
