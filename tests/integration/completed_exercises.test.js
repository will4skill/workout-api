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
