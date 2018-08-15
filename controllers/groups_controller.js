var config = require('config');
var fs = require('fs');

var fileName = config.get('groups.filePath');

const NO_OF_COLONS_IN_A_GROUP_RECORD = 3;

function readGroupsFile () {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'ascii', (err, data) => {
        if (err) reject(err);
        else resolve(data);
        });
    }); 
}

function parseGroups(groupRecords) {
    return groupRecords.split('\n')
        .filter((groupRecord) => {
            return (groupRecord.split(":").length - 1 === NO_OF_COLONS_IN_A_GROUP_RECORD);
        })
        .map((groupRecord) => {
            var fields = groupRecord.split(':');
            return {
                name    : fields[0],
                gid     : parseInt(fields[2]),
                members : (fields[3] ? fields[3].split(',') : [])
            };
        });
}

async function getAllGroups() {
    let data = {};
    try {
        data = await readGroupsFile();
    } catch (error) {
        throw error;
    }
    let processedData = parseGroups(data);
    return processedData;
}

async function getGroupById(gid) {
    let data = {};
    try {
        data = await readGroupsFile();
    } catch (error) {
        throw error;
    }
    return parseGroups(data).find(group => group.gid === gid);
}

async function getGroupsMatching (options) {
    let {name, gid, members} = {name: options.name, gid: options.gid, members: options.members};

    let data = {};
    try {
        data = await readGroupsFile();
    } catch (error) {
        throw error;
    }
    let processedData = parseGroups(data);
    return processedData.filter(group => {        
        if(typeof name !== 'undefined' && group.name !== name) {
            return false;
        }
        if(typeof gid !== 'undefined' && group.gid !== gid) {
            return false;
        }
        if(typeof members !== 'undefined' && !members.every(member => group.members.includes(member))){
            return false;
        }            
        return true;
    });
}

module.exports.getAllGroups = getAllGroups;
module.exports.getGroupById = getGroupById;
module.exports.getGroupsMatching = getGroupsMatching;
