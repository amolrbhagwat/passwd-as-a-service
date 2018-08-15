# passwd-as-a-service

This is a minimal API service which exposes user and group information on a UNIX-like system from the /etc/passwd and /etc/group files.

---

## Running the service

- Prerequisites: Node.js v8.11, Nodemon.
- On a UNIX-like system, run the following commands:

1. `git clone https://github.com/amolrbhagwat/passwd-as-a-service.git`
2. `cd passwd-as-a-service`
3. `sudo npm install`
4. `npm run start`

---

## Endpoints

#### - GET /users

- Returns an array of all the users present on the system.
- Fields returned: name, uid, gid, comment, home, shell.

#### - GET /users/query?[name=\<nq>][&uid=\<uq>][&gid=\<gq>][&comment=\<cq>][&home=\<hq>][&shell=\<sq>]

- Any combination of the query fields may be provided, returns all users whose fields match _EVERY_ one of the query fields provided.
- If any field is repeated, only the first value will be used. Invalid fields are ignored.
- uid and gid must be numbers, else a 400 Bad Request will be returned.
- Fields returned: name, uid, gid, comment, home, shell.
- Returns a 404 if no matches were found.

#### - GET /users/\<uid>

- Returns a single user with the \<uid>.
- Returns a 404 if a user is not found.
- Fields returned: name, uid, gid, comment, home, shell.

#### - GET /users/\<uid>/groups

- Returns all the groups for a given user.
- Returns a 404 if the user was not found on the system, returns with 200 and array of groups if the user is present.
- Fields returned: name, gid, members.

#### - GET /groups

- Returns an array with all the groups present on the system.
- Fields returned: name, gid, members.

#### - GET /groups/query?[name=\<nq>][&gid=<gq>][&member=\<mq1>][&member=\<mq2>][...]

- Any combination of the query fields may be provided, returns all groups whose fields match _EVERY_ one of the query fields provided.
- If any field is repeated, only the first value will be used, except for 'member'. Invalid fields are ignored.
- gid must be a number, else a 400 Bad Request will be returned.
- Fields returned: name, gid, members.
- Returns a 404 if no matches were found.

#### - GET /groups/\<gid>

- Returns a single group with the \<gid>.
- Returns a 404 if the group is not found.
- Fields returned: name, gid, members.

---

## Notes on passwd-as-a-service

- The service can be started in three different modes: development, production, and test. They can be started as follows:
  - `npm run start-dev`
  - `npm run start`
  - `npm run test` (This will run all the unit tests.)
- The configuration is loaded from the config/ directory, and the file is decided based on the NODE_ENV environment variable. You may modify the file paths based on your environment.
- Errors are logged onto the console in all modes.
- Both users_controller, and groups_controller have similar structures. Methods in both the controllers read a file in, parse them to get all the records, and then operate on them.
  <u>Note</u>: The rows are split from the files on a newline character. The validation to check if a row is valid counts the number of colons on a line. In case the file read has a Mac line-ending (CR), no rows might be read.
