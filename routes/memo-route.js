var express = require('express');
var router = express.Router();
var Memos = require('../models/memos');
var Users = require('../models/users');
var DesignTemplates = require('../models/designTemplates');
const { routes } = require('../app');

// GET /memos - Get all memos with user and template info
router.get('/', function(req, res, next) {
  // Memos.findAll();
  Memos.findAll({
    include: [
      { 
        model: Users, 
        as: 'user',
        attributes: { exclude: ['password'] }
      },
      { model: DesignTemplates, as: 'template' }
    ]
  }).then((memos) => {
    res.json(memos);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// GET /memos/:id - Get specific memo with user and template info
router.get('/:id', function(req, res, next) {
  const memoId = req.params.id;
  
  Memos.findByPk(memoId, {
    include: [
      { 
        model: Users, 
        as: 'user',
        attributes: { exclude: ['password'] }
      },
      { model: DesignTemplates, as: 'template' }
    ]
  }).then((memo) => {
    if (memo) {
      res.json(memo);
    } else {
      res.status(404).json({ error: 'Memo not found' });
    }
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// POST /memos - Create new memo
router.post('/', function(req, res, next) {
  const { title, content, templateId, userId } = req.body;
  
  // Validate required fields
  if (!title || !content || !templateId || !userId) {
    return res.status(400).json({ error: 'Missing required fields: title, content, templateId, userId' });
  }
  
  const memoData = {
    // id, createdAt, updatedAt는 자동 생성되므로 제거
    title,
    content,
    templateId: parseInt(templateId),
    userId: parseInt(userId)
  };
  
  Memos.create(memoData).then((memo) => {
    res.status(201).json(memo);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// PUT /memos/:id - Full update memo (all fields required)
router.put('/:id', function(req, res, next) {
  const memoId = req.params.id;
  const { title, content, templateId, userId } = req.body;
  
  // Validate all required fields for full update
  if (!title || !content || !templateId || !userId) {
    return res.status(400).json({ 
      error: 'All fields are required for full update: title, content, templateId, userId' 
    });
  }
  
  Memos.findByPk(memoId).then((memo) => {
    if (!memo) {
      return res.status(404).json({ error: 'Memo not found' });
    }
    
    // Update all fields (updatedAt는 Sequelize가 자동으로 업데이트)
    memo.title = title;
    memo.content = content;
    memo.templateId = templateId;
    memo.userId = userId;
    
    return memo.save();
  }).then((updatedMemo) => {
    res.json(updatedMemo);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// PATCH /memos/:id - Partial update memo (only provided fields)
router.patch('/:id', function(req, res, next) {
  const memoId = req.params.id;
  const { title, content, templateId, userId } = req.body;
  
  Memos.findByPk(memoId).then((memo) => {
    if (!memo) {
      return res.status(404).json({ error: 'Memo not found' });
    }
    
    // Update only provided fields (updatedAt는 Sequelize가 자동으로 업데이트)
    if (title !== undefined) memo.title = title;
    if (content !== undefined) memo.content = content;
    if (templateId !== undefined) memo.templateId = templateId;
    if (userId !== undefined) memo.userId = userId;
    
    return memo.save();
  }).then((updatedMemo) => {
    res.json(updatedMemo);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// DELETE /memos/:id - Delete memo
router.delete('/:id', function(req, res, next) {
  const memoId = req.params.id;
  
  Memos.findByPk(memoId).then((memo) => {
    if (!memo) {
      return res.status(404).json({ error: 'Memo not found' });
    }
    
    return memo.destroy();
  }).then(() => {
    res.status(204).send();
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

module.exports = router;