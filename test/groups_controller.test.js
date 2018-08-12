/* eslint-env mocha */
var assert = require('assert');

var groupsController = require('../controllers/groups_controller');

describe('Groups Controller', function() {
    it('should return all groups from the group file', async function() {
        var expectedData = [
            {"name": "root",   "gid": 0, "members": []},
            {"name": "daemon", "gid": 1, "members": []},
            {"name": "bin",    "gid": 2, "members": ['bin']},
            {"name": "sys",    "gid": 3, "members": ['sys']},
            {"name": "adm",    "gid": 4, "members": ['foo', 'bar']},
            {"name": "tty",    "gid": 5, "members": []},
            {"name": "disk",   "gid": 6, "members": []},
            {"name": "lp",     "gid": 7, "members": []},
            {"name": "mail",   "gid": 8, "members": []},
            {"name": "news",   "gid": 9, "members": ['foo', 'bin']}
        ];

        var actualData = await groupsController.getAllGroups();
        assert.deepEqual(actualData, expectedData);
    });

    it('should return a group by ID', async function() {
        var expectedData = {"name": "root", "gid": 0, "members": []};
        var actualData = await groupsController.getGroupById(0);
        assert.deepEqual(actualData, expectedData);

        var expectedData2 = {"name": "adm", "gid": 4, "members": ['foo', 'bar']};
        var actualData2 = await groupsController.getGroupById(4);
        assert.deepEqual(actualData2, expectedData2);
    });

    it('should return groups matching criteria', async function() {
        var options = {name: 'root'};
        var expectedData = [{name: 'root', 'gid': 0, members: []}];
        var actualData = await groupsController.getGroupsMatching(options);
        assert.deepEqual(actualData, expectedData);

        var options2 = {gid: 9};
        var expectedData2 = [{name: 'news', 'gid': 9, members: ['foo', 'bin']}];
        var actualData2 = await groupsController.getGroupsMatching(options2);
        assert.deepEqual(actualData2, expectedData2);

        var options3 = {members: ['bar']};
        var expectedData3 = [{name: 'adm', 'gid': 4, members: ['foo', 'bar']}];
        var actualData3 = await groupsController.getGroupsMatching(options3);
        assert.deepEqual(actualData3, expectedData3);

        var options4 = {members: ['foo']};
        var expectedData4 = [{name: 'adm',  'gid': 4, members: ['foo', 'bar']},
                             {name: 'news', 'gid': 9, members: ['foo', 'bin']}];
        var actualData4 = await groupsController.getGroupsMatching(options4);
        assert.deepEqual(actualData4, expectedData4);

        var options5 = {members: ['baz']};
        var expectedData5 = [];
        var actualData5 = await groupsController.getGroupsMatching(options5);
        assert.deepEqual(actualData5, expectedData5);
    });

});
