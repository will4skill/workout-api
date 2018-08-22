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