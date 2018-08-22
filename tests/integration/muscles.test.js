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