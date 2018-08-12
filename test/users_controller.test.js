/* eslint-env mocha */
var assert = require('assert');

var usersController = require('../controllers/users_controller');

describe('Users Controller', function() {
    it('should return all users from the passwd file', async function() {
        var expectedData = [
            {"name": "root", "uid": 0, "gid": 0, "comment": "root", "home": "/root", "shell": "/bin/bash"},
            {"name": "bin",  "uid": 2, "gid": 2, "comment": "bin",  "home": "/bin",  "shell": "/usr/sbin/nologin"},
            {"name": "sys",  "uid": 3, "gid": 3, "comment": "sys",  "home": "/dev",  "shell": "/usr/sbin/nologin"},
            {"name": "sync", "uid": 4, "gid": 65534, "comment": "sync",  "home": "/bin",  "shell": "/bin/sync"},
            {"name": "games", "uid": 5, "gid": 60, "comment": "games",  "home": "/usr/games",  "shell": "/usr/sbin/nologin"}
        ];

        var actualData = await usersController.getAllUsers();
        assert.deepEqual(actualData, expectedData);
    });

    it('should return a user by ID', async function() {
        var expectedData = {"name": "root", "uid": 0, "gid": 0, "comment": "root", "home": "/root", "shell": "/bin/bash"};

        var actualData = await usersController.getUserById(0);
        assert.deepEqual(actualData, expectedData);
    });

    it('should return users matching criteria', async function() {
        // Grab an existing user
        var options = {name: 'root'};
        var expectedData = [{"name": "root", "uid": 0, "gid": 0, "comment": "root", "home": "/root", "shell": "/bin/bash"}];
        var actualData = await usersController.getUsersMatching(options);
        assert.deepEqual(actualData, expectedData);

        // Grab a non-existent user
        var options2 = {uid: 100};
        var expectedData2 = [];
        var actualData2 = await usersController.getUsersMatching(options2);
        assert.deepEqual(actualData2, expectedData2);

        // Two options, both match
        var options3 = {gid: 60, comment: 'games'};
        var expectedData3 = [{"name": "games", "uid": 5, "gid": 60, "comment": "games", "home": "/usr/games",
                                "shell": "/usr/sbin/nologin"}];
        var actualData3 = await usersController.getUsersMatching(options3);
        assert.deepEqual(actualData3, expectedData3);

        // Two options, one matches
        var options4 = {uid: 0, home: '/dev'};
        var expectedData4 = [];
        var actualData4 = await usersController.getUsersMatching(options4);
        assert.deepEqual(actualData4, expectedData4);

        // One option, multiple results
        var options5 = {shell: '/usr/sbin/nologin'};
        var expectedData5 = [
            {"name": "bin", "uid": 2, "gid": 2, "comment": "bin", "home": "/bin", "shell": "/usr/sbin/nologin"},
            {"name": "sys", "uid": 3, "gid": 3, "comment": "sys", "home": "/dev", "shell": "/usr/sbin/nologin"},
            {"name": "games", "uid": 5, "gid": 60, "comment": "games", "home": "/usr/games", "shell": "/usr/sbin/nologin"}
        ];
        var actualData5 = await usersController.getUsersMatching(options5);
        assert.deepEqual(actualData5, expectedData5);
    });

    it('should return groups for a user', async function() {
        // Non-existent user
        var uid = 100;
        var expectedData = [];
        var actualData = await usersController.getGroupsByUserId(uid);
        assert.deepEqual(actualData, expectedData);

        // No groups for user
        var uid2 = 0;
        var expectedData2 = [];
        var actualData2 = await usersController.getGroupsByUserId(uid2);
        assert.deepEqual(actualData2, expectedData2);

        // User is in one group
        var uid3 = 3;
        var expectedData3 = [{"name": "sys", "gid": 3, "members": ['sys']}];
        var actualData3 = await usersController.getGroupsByUserId(uid3);
        assert.deepEqual(actualData3, expectedData3);

        // User is in multiple groups
        var uid4 = 2;
        var expectedData4 = [{"name": "bin", "gid": 2, "members": ['bin']},
                             {"name": "news", "gid": 9, "members": ['foo', 'bin']}];
        var actualData4 = await usersController.getGroupsByUserId(uid4);
        assert.deepEqual(actualData4, expectedData4);
    });
});
