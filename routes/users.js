var express = require('express');
var router = express.Router();
var Users = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Users.findAll().then((users) => {
    res.json(users);
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
  // res.send('respond with a resource');
});

module.exports = router;
