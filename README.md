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
4. ``` $ cd workout_api ``` # navigate to project's root directory
5. ``` $ npm i ``` # install the packages listed in package.json
6. From the command line, set the value of the jwt_private_key environment variable (this private key is used to create the JSON Web tokens that allow users to securely log in to the application.)
   * Example (Mac): ``` $ export jwt_private_key=your_private_key ```
7. ``` $ npm test <file.name.test.js> ``` # Run tests (for some reason, the tests fail unless the files are tested individually)
8. ``` $ npm start ``` # start server
9. ``` $ mongod ``` # run the Mongo daemon
10. ``` $ node seed_db ``` # seed the database with muscles and exercises
11. Done. You can now use a command line tool like ``` $ curl ```, or an application like Postman to test the API endpoints.

## App Structure
<p align="center">
  <img alt="Image of App Structure" src="https://raw.github.com/jtimwill/workout_api/master/images/workout-API-diagram.png" />
</p>

## Entity Relationship Diagram
<p align="center">
  <img alt="Image of ERD" src="https://raw.github.com/jtimwill/workout_api/master/images/workout-erd.png" />
</p>

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
