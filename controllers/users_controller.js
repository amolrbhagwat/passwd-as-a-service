var config = require('config');
var fs = require('fs');

var groupsController = require('./groups_controller');

var fileName = config.get('users.filePath');

function readUsersFile () {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'ascii', (err, data) => {
        if (err) reject(err);
        else resolve(data);
        });
    }); 
}

function parseUsers(userRecords) {
    return userRecords.split('\n')
        .filter((userRecord) => {
            return userRecord.length;
        })
        .map((userRecord) => {
            var fields = userRecord.split(':');
            return {
                name    : fields[0],
                uid     : parseInt(fields[2]),
                gid     : parseInt(fields[3]),
                comment : fields[4],
                home    : fields[5],
                shell   : fields[6]
            };
        });
}

async function getAllUsers() {
    let data = await readUsersFile();
    let processedData = parseUsers(data);
    return processedData;
}

async function getUserById(uid) {
    let data = await readUsersFile();
    return parseUsers(data).find(user => user.uid === uid);
}

async function getUsersMatching (options) {
    let {name, uid, gid, comment, home, shell} = {name: options.name, uid: options.uid, gid: options.gid,
        comment: options.comment, home: options.home, shell: options.shell};

    let data = await readUsersFile();
    let processedData = parseUsers(data);
    return processedData.filter(user => {
        if(typeof name !== 'undefined' && user.name !== name) {
            return false;
        }
        if(typeof uid !== 'undefined' && user.uid !== uid) {
            return false;
        }
        if(typeof gid !== 'undefined' && user.gid !== gid) {
            return false;
        }
        if(typeof comment !== 'undefined' && user.comment !== comment) {
            return false;
        }
        if(typeof home !== 'undefined' && user.home !== home) {
            return false;
        }
        if(typeof shell !== 'undefined' && user.shell !== shell) {
            return false;
        }        
        
        return true;
    });
}

async function getGroupsByUserId(uid) {
    let user = await getUserById(uid);
    if(typeof user === 'undefined') {
        return [];
    }
    
    let userName = user.name;
    let groups = await groupsController.getAllGroups();

    return groups.filter(group => {
        return group.members.includes(userName);
    });
}

module.exports.getAllUsers = getAllUsers;
module.exports.getUserById = getUserById;
module.exports.getUsersMatching = getUsersMatching;
module.exports.getGroupsByUserId = getGroupsByUserId;
