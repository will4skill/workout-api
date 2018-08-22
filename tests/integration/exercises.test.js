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