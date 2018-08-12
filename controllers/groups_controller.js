var config = require('config');
var fs = require('fs');

var fileName = config.get('groups.filePath');

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
            return groupRecord.length;
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
    let data = await readGroupsFile();
    let processedData = parseGroups(data);
    return processedData;
}

async function getGroupById(gid) {
    let data = await readGroupsFile();
    return parseGroups(data).find(group => group.gid === gid);
}

async function getGroupsMatching (options) {
    let {name, gid, members} = {name: options.name, gid: options.gid, members: options.members};

    let data = await readGroupsFile();
    let processedData = parseGroups(data);
    return processedData.filter(group => {        
        if(name && group.name !== name) {
            return false;
        }
        if(gid && group.gid !== gid) {
            return false;
        }
        if(members && !members.every(member => group.members.includes(member))){
            return false;
        }            
        return true;
    });
}

module.exports.getAllGroups = getAllGroups;
module.exports.getGroupById = getGroupById;
module.exports.getGroupsMatching = getGroupsMatching;
