var express = require('express');
var router = express.Router();

var usersController = require('../controllers/users_controller');

router.get('/', async function(req, res) {
    try {
        var allUsers = await usersController.getAllUsers();
        res.json(allUsers);
    } catch (error) {
        res.status(500).send('An internal server error occurred.');
    }
});

router.get('/query', async function(req, res) {
  try {
      var options = {};
      var { name, uid, gid, comment, home, shell } = req.query;
      
      if(typeof name !== 'undefined')    options.name    = (typeof name === 'object')    ? name[0] : name;
      if(typeof uid !== 'undefined')     options.uid     = (typeof uid === 'object')     ? parseInt(uid[0]) : parseInt(uid);
      if(typeof gid !== 'undefined')     options.gid     = (typeof gid === 'object')     ? parseInt(gid[0]) : parseInt(gid);
      if(typeof comment !== 'undefined') options.comment = (typeof comment === 'object') ? comment[0] : comment;
      if(typeof home !== 'undefined')    options.home    = (typeof home === 'object')    ? home[0] : home;
      if(typeof shell !== 'undefined')   options.shell   = (typeof shell === 'object')   ? shell[0] : shell;

      if((typeof options.uid !== 'undefined') && isNaN(options.uid)) {
        res.status(400).send('Please check your request.');
        return;
      }
      if((typeof options.gid !== 'undefined') && isNaN(options.gid)) {
        res.status(400).send('Please check your request.');
        return;
      }

      var results = await usersController.getUsersMatching(options);
      if(results.length === 0) {
          res.status(404).send('Not found.');
          return;
      }
      res.json(results);
  } catch (error) {
      res.status(500).send('An internal server error occurred.');
  }
});

router.get('/:uid', async function(req, res) {
  try {
      var uid = parseInt(req.params.uid);
      if (isNaN(uid)) {
          res.status(400).send('Please check your request.');
          return;
      }
      var user = await usersController.getUserById(uid);
      if (!user) {
          res.status(404).send('Not found.');
          return;
      }
      res.json(user);
  } catch (error) {
      res.status(500).send('An internal server error occurred.');
  }
});

router.get('/:uid/groups', async function(req, res) {
  try {
      var uid = parseInt(req.params.uid);
      if (isNaN(uid)) {
          res.status(400).send('Please check your request.');
          return;
      }
      var user = await usersController.getUserById(uid);
      if (!user) {
        res.status(404).send('Not found.');
        return;
      }
      var groups = await usersController.getGroupsByUserId(uid);
      res.json(groups);
  } catch (error) {
      res.status(500).send('An internal server error occurred.');
  }
});

module.exports = router;
