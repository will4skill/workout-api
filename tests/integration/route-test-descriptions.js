// API/Login

'POST /' // log user in with email and password
// 1. return 400 if request params are invalid
// 2. return 400 if email not in database
// 3. return 400 if password not in database
// 4. create new authToken
// 5. create remember_digest in db
// 6. return JWToken to client (stat code 200)

// API/Logout

'DELETE /' // log current user out (user ID from JWT)
// 1. return 400 if client not logged in
// 2. return 403 if user is not current user
// 3. return 404 if invalid ID
// 5. set remember_digest to nil db (stat code 200)


// API/Users

'GET /' // Return all users
// 1. return 401 if client not logged in
// 2. return 403 if user is not admin
// 3. return all users (stat code 200)

'POST /' // Create new user
// 1. return 401 if client not logged in
// 2. return 400 if user is invalid (or exists already)
// 3. Save user if user is valid
// 4. Return user if user is valid

'GET /ME' // Get specific user (user ID from JWT)
// 1. return 401 if client not logged in
// 2. return 404 if invalid ID
// 3. return 404 if ID valid but ID not in DB
// 4. return specific user if valid ID

'PUT /ID' // Update specific user (user ID from JWT)
// 1. return 401 if client not logged in
// 2. return 400 if user is invalid
// 3. return 404 if invalid ID
// 4. return 404 if id valid but ID not in DB 
// 5. update user if input is valid
// 6. return updated user if it is valid

'DELETE /ID' // Delete specific user (user ID from JWT)
// 1. return 401 if client not logged in
// 2. return 403 if user is not current user
// 3. return 404 if invalid ID
// 4. return 404 if id valid but ID not in DB
// 5. delete user if input is valid
// 6. return deleted user


// API/Workouts

'GET /' // Return all workouts for current user (user ID from JWT)
// 1. return 401 if client not logged in
// 2. return all workouts for current user (stat code 200)

'POST /' // Create new workout for current user (user ID from JWT)
// 1. return 401 if client not logged in
// 2. return 400 if workout is invalid
// 3. Save workout if workout is valid [* User -> Workout *]
//    a. workout should have >= 1 completed_exercise
// 4. Return workout if workout is valid

'GET /ID' // Get specific workout for current user (user ID from JWT)
// 1. return 401 if client not logged in
// 2. return 404 if invalid workout ID
// 3. return 404 if workoutID valid but workoutID not in DB
// 4. return specific workout if valid workoutID

'PUT /ID' // Update specific workout for current user (user ID from JWT)
// 1. return 401 if client not logged in
// 2. return 400 if workout is invalid
// 3. return 404 if invalid workoutID
// 4. return 404 if workoutID valid but workoutID not in DB 
// 5. update workout if input is valid
// 6. return updated workout if it is valid

'DELETE /ID' // Delete specific workout for current user (user ID from JWT)
// 1. return 401 if client not logged in
// 2. return 403 if user is not current user
// 3. return 404 if invalid workoutID
// 4. return 404 if workoutID valid but workoutID not in DB
// 5. delete workout if input is valid
// 6. return deleted workout


// API/workouts/:id/completed_exercises

'GET /' // Return all completed_exercises for current workout (workoutId in params)
// 1. return 401 if client not logged in
// 2. return all completed_exercises for current workout (stat code 200)

'POST /' // Create new completed_exercise for current workout (workoutId in params)
// 1. return 401 if client not logged in
// 2. return 400 if completed_exercise is invalid
// 3. Save completed_exercise if completed_exercise is valid [* Workout -> Workout_Completed *]
//    a. completed_exercise should have an associated workout
// 4. Return completed_exercise if completed_exercise is valid

'GET /ID' // Get specific completed_exercise for current workout (workoutId in params)
// 1. return 401 if client not logged in
// 2. return 404 if invalid completed_exercise ID
// 3. return 404 if completed_exerciseID valid but completed_exerciseID not in DB
// 4. return specific completed_exerciseID if valid completed_exerciseID

'PUT /ID' // Update specific completed_exercise for current workout (workoutId in params)
// 1. return 401 if client not logged in
// 2. return 400 if completed_exercise is invalid
// 3. return 404 if invalid completed_exerciseID
// 4. return 404 if completed_exerciseID valid but completed_exerciseID not in DB 
// 5. update completed_exercise if input is valid
// 6. return updated completed_exercise if it is valid

'DELETE /ID' // Delete specific completed_exercise for current workout (workoutId in params)
// 1. return 401 if client not logged in
// 2. return 403 if user is not current user (userID from JWT)
// 3. return 404 if invalid completed_exerciseID
// 4. return 404 if completed_exerciseID valid but completed_exerciseID not in DB
// 5. delete completed_exercise if input is valid
// 6. return deleted completed_exercise


// API/exercises

'GET /' // Return all exercises
// 1. return 401 if client not logged in
// 2. return all exercises (stat code 200)

'POST /' // Create new exercise
// 1. return 401 if client not logged in
// 2. return 403 if user is not admin
// 3. return 400 if exercise is invalid
// 4. Save exercise if exercise is valid [* Exercise - Muscle *]
// 5. Return exercise if exercise is valid

'GET /ID' // Get specific exercise
// 1. return 401 if client not logged in
// 2. return 403 if user is not admin
// 3. return 404 if invalid exercise ID
// 4. return 404 if exerciseID valid but exerciseID not in DB
// 5. return specific exercise if valid exerciseID

'PUT /ID' // Update specific exercise
// 1. return 401 if client not logged in
// 2. return 403 if user is not admin
// 3. return 400 if exercise is invalid
// 4. return 404 if invalid exerciseID
// 5. return 404 if exerciseID valid but exerciseID not in DB 
// 6. update exercise if input is valid
// 7. return updated exercise if it is valid

'DELETE /ID' // Delete specific exercise
// 1. return 401 if client not logged in
// 2. return 403 if user is not admin
// 3. return 404 if invalid exerciseID
// 4. return 404 if exerciseID valid but exerciseID not in DB
// 5. delete exercise if input is valid
// 6. return deleted exercise


// API/muscles

'GET /' // Return all muscles
// 1. return 401 if client not logged in
// 2. return all muscles (stat code 200)

'POST /' // Create new muscle
// 1. return 401 if client not logged in
// 2. return 403 if user is not admin
// 3. return 400 if muscle is invalid
// 4. Save muscle if muscle is valid 
// 5. Return muscle if muscle is valid

'GET /ID' // Get specific muscle
// 1. return 401 if client not logged in
// 2. return 403 if user is not admin
// 3. return 404 if invalid muscle ID
// 4. return 404 if muscleID valid but muscleID not in DB
// 5. return specific muscle if valid muscleID

'PUT /ID' // Update specific muscle
// 1. return 401 if client not logged in
// 2. return 403 if user is not admin
// 3. return 400 if muscle is invalid
// 4. return 404 if invalid muscleID
// 5. return 404 if muscleID valid but muscleID not in DB 
// 6. update muscle if input is valid
// 7. return updated muscle if it is valid

'DELETE /ID' // Delete specific muscle
// 1. return 401 if client not logged in
// 2. return 403 if user is not admin
// 3. return 404 if invalid muscleID
// 4. return 404 if muscleID valid but muscleID not in DB
// 5. delete muscle if input is valid
// 6. return deleted muscle