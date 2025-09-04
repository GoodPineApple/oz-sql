var express = require('express');
var router = express.Router();
var Users = require('../models/users');

// GET /users - Get all users
router.get('/', function(req, res, next) {
  Users.findAll().then((users) => {
    res.json(users);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// GET /users/:id - Get specific user
router.get('/:id', function(req, res, next) {
  const userId = req.params.id;
  
  Users.findByPk(userId).then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// POST /users - Create new user
router.post('/', function(req, res, next) {
  const { username, password, email } = req.body;
  
  // Validate required fields
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Missing required fields: username, password, email' });
  }
  
  const userData = {
    // id, createdAt, updatedAt는 자동 생성되므로 제거
    username,
    password,
    email
  };
  
  Users.create(userData).then((user) => {
    res.status(201).json(user);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// PUT /users/:id - Full update user (all fields required)
router.put('/:id', function(req, res, next) {
  const userId = req.params.id;
  const { username, email } = req.body;
  
  // Validate all required fields for full update
  if (!username || !email) {
    return res.status(400).json({ 
      error: 'All fields are required for full update: username, email' 
    });
  }
  
  Users.findByPk(userId).then((user) => {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update all fields
    user.username = username;
    user.email = email;
    
    return user.save();
  }).then((updatedUser) => {
    res.json(updatedUser);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// PATCH /users/:id - Partial update user (only provided fields)
router.patch('/:id', function(req, res, next) {
  const userId = req.params.id;
  const { username, email } = req.body;
  
  Users.findByPk(userId).then((user) => {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update only provided fields
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    
    return user.save();
  }).then((updatedUser) => {
    res.json(updatedUser);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// DELETE /users/:id - Delete user
router.delete('/:id', function(req, res, next) {
  const userId = req.params.id;
  
  Users.findByPk(userId).then((user) => {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return user.destroy();
  }).then(() => {
    res.status(204).send();
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

module.exports = router;