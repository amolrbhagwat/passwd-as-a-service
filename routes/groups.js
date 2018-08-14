var express = require('express');
var router = express.Router();

var groupsController = require('../controllers/groups_controller');

router.get('/', async function(req, res) {
    try {
        var allGroups = await groupsController.getAllGroups();
        res.json(allGroups);
    } catch (error) {
        res.status(500).send('An internal server error occurred.');
    }
});

router.get('/query', async function(req, res) {
    try {
        var options = {};
        var { name, gid } = req.query;
        // When multiple query params have same name, we will get an array.
        var members = req.query.member;

        if(name) {
            if(typeof name === 'object'){
                options.name = name[0];
            } else{
                options.name = name;
            }
        }
        if((typeof gid !== 'undefined') && isNaN(gid)) {
            res.status(400).send('Please check your request.');
            return;
        } else if(typeof gid !== 'undefined') {
            options.gid = parseInt(gid);
        }
        if(members) {
            if(typeof members === 'string'){
                options.members = [];
                options.members.push(members);
            } else{
                options.members = members;
            }
        }
        var results = await groupsController.getGroupsMatching(options);
        if(results.length === 0) {
            res.status(404).send('Not found.');
            return;
        }
        res.json(results);
    } catch (error) {
        res.status(500).send('An internal server error occurred.');
    }
});

router.get('/:gid', async function(req, res) {
    try {
        var gid = parseInt(req.params.gid);
        if (isNaN(gid)) {
            res.status(400).send('Please check your request.');
            return;
        }
        var group = await groupsController.getGroupById(gid);
        if (!group) {
            res.status(404).send('Not found.');
            return;
        }
        res.json(group);
    } catch (error) {
        res.status(500).send('An internal server error occurred.');
    }
});

module.exports = router;
