# Workout API

## Project Description
This is a simple API that can be used to track a user's workouts. The structure of this project is based on what I learned in the following course: https://codewithmosh.com/p/the-complete-node-js-course
 
 The basic technology stack is:
* MongoDB + Mongoose (database)
* Express (web server)
* Jest (testing framework)
* Node.js (run-time environment)

## Project Setup
1. Install Node.js: https://nodejs.org/
2. Install MongoDB: https://www.mongodb.com/
3. Download project files
4. $ cd workout_api # navigate to project's root directory
5. $ npm i # install the packages listed in package.json
6. From the command line, set the value of the jwt_private_key environment variable (this private key is used to create the JSON Web tokens that allow users to securely log in to the application.)
..* Example (Mac): $ export jwt_private_key=your_private_key
7. $ npm test <file.name.test.js> # Run tests (for some reason, the tests fail unless the files are tested individually)
8. $ npm start # start server
9. $ mongod # run the Mongo daemon
10. Done. You can now use a command line tool like $ curl, or an application like Postman to test the API endpoints.

## Entity Relationship Diagram

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/8.8.0 Chrome/61.0.3163.100 Electron/2.0.2 Safari/537.36" version="9.1.2" editor="www.draw.io" type="device"><diagram id="37abf2d3-b5b4-20dd-dbf3-ae0ddc546b02" name="Page-1">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</diagram></mxfile>
```


## Routes and Resources
### Users Resource
|URL|HTTP verb|Result|Admin only?|
|---|---|---|---|
/api/users|POST|create a new user|No|
/api/users|GET|return all users|Yes|
/api/users/me|GET|return current user|No|
/api/users/me|PUT|update current user|No|
/api/users/:id|DELETE|delete a user|Yes|

### Workouts Resource
|URL|HTTP verb|Result|Admin only?|
|---|---|---|---|
/api/workouts|POST|create a new workout|No|
/api/workouts|GET|return all workouts for current user|No|
/api/workouts/:id|GET|return a specific workout for current user|No|
/api/workouts/:id|PUT|update a specific workout for current user|No|
/api/workouts/:id|DELETE|delete a specific workout for current user|No|
/api/workouts/:id/completed_exercises|POST|create a new completed_workout for a specific workout for current user|No|

### Completed_Exercises Resource
|URL|HTTP verb|Result|Admin only?|
|---|---|---|---|
/api/completed_exercises/:id|GET|return a specific completed_exercise for current user|No|
/api/completed_exercises/:id|PUT|update a specific completed_exercise for current user|Yes|
/api/completed_exercises/:id|DELETE|delete a specific completed_exercise for current user|No|

### Exercises Resource
|URL|HTTP verb|Result|Admin only?|
|---|---|---|---|
/api/exercises|POST|create a new exercise|Yes|
/api/exercises|GET|return all exercises|No|
/api/exercises/:id|GET|return a specific exercise|Yes|
/api/exercises/:id|PUT|update a specific exercises|Yes|
/api/exercises/:id|DELETE|delete a specific exercise|Yes|

### Muscles Resource
|URL|HTTP verb|Result|Admin only?|
|---|---|---|---|
/api/muscles|POST|create a new muscle|Yes|
/api/muscles|GET|return all muscles|No|
/api/muscles/:id|GET|return a specific muscle|Yes|
/api/muscles/:id|PUT|update a specific muscle|Yes|
/api/muscles/:id|DELETE|delete a specific muscle|Yes|

### Login Resource
|URL|HTTP verb|Result|Admin only?|
|---|---|---|---|
/api/login|POST|return a new JSON web token that can be used to identify the current user|No|
