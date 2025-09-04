var express = require('express');
var router = express.Router();
var DesignTemplates = require('../models/designTemplates');

// GET /designTemplates - Get all design templates
router.get('/', function(req, res, next) {
  DesignTemplates.findAll().then((templates) => {
    res.json(templates);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// GET /designTemplates/:id - Get specific design template
router.get('/:id', function(req, res, next) {
  const templateId = req.params.id;
  
  DesignTemplates.findByPk(templateId).then((template) => {
    if (template) {
      res.json(template);
    } else {
      res.status(404).json({ error: 'Design template not found' });
    }
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// POST /designTemplates - Create new design template
router.post('/', function(req, res, next) {
  const { name, backgroundColor, textColor, borderStyle, shadowStyle, preview } = req.body;
  
  // Validate required fields
  if (!name || !backgroundColor || !textColor || !borderStyle || !shadowStyle || !preview) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, backgroundColor, textColor, borderStyle, shadowStyle, preview' 
    });
  }
  
  const templateData = {
    // id, createdAt, updatedAt는 자동 생성되므로 제거
    name,
    backgroundColor,
    textColor,
    borderStyle,
    shadowStyle,
    preview
  };
  
  DesignTemplates.create(templateData).then((template) => {
    res.status(201).json(template);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// PUT /designTemplates/:id - Full update design template (all fields required)
router.put('/:id', function(req, res, next) {
  const templateId = req.params.id;
  const { name, backgroundColor, textColor, borderStyle, shadowStyle, preview } = req.body;
  
  // Validate all required fields for full update
  if (!name || !backgroundColor || !textColor || !borderStyle || !shadowStyle || !preview) {
    return res.status(400).json({ 
      error: 'All fields are required for full update: name, backgroundColor, textColor, borderStyle, shadowStyle, preview' 
    });
  }
  
  DesignTemplates.findByPk(templateId).then((template) => {
    if (!template) {
      return res.status(404).json({ error: 'Design template not found' });
    }
    
    // Update all fields
    template.name = name;
    template.backgroundColor = backgroundColor;
    template.textColor = textColor;
    template.borderStyle = borderStyle;
    template.shadowStyle = shadowStyle;
    template.preview = preview;
    
    return template.save();
  }).then((updatedTemplate) => {
    res.json(updatedTemplate);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// PATCH /designTemplates/:id - Partial update design template (only provided fields)
router.patch('/:id', function(req, res, next) {
  const templateId = req.params.id;
  const { name, backgroundColor, textColor, borderStyle, shadowStyle, preview } = req.body;
  
  DesignTemplates.findByPk(templateId).then((template) => {
    if (!template) {
      return res.status(404).json({ error: 'Design template not found' });
    }
    
    // Update only provided fields
    if (name !== undefined) template.name = name;
    if (backgroundColor !== undefined) template.backgroundColor = backgroundColor;
    if (textColor !== undefined) template.textColor = textColor;
    if (borderStyle !== undefined) template.borderStyle = borderStyle;
    if (shadowStyle !== undefined) template.shadowStyle = shadowStyle;
    if (preview !== undefined) template.preview = preview;
    
    return template.save();
  }).then((updatedTemplate) => {
    res.json(updatedTemplate);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

// DELETE /designTemplates/:id - Delete design template
router.delete('/:id', function(req, res, next) {
  const templateId = req.params.id;
  
  DesignTemplates.findByPk(templateId).then((template) => {
    if (!template) {
      return res.status(404).json({ error: 'Design template not found' });
    }
    
    return template.destroy();
  }).then(() => {
    res.status(204).send();
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

module.exports = router;
