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
