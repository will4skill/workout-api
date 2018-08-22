// API/Logout

'DELETE /' // log current user out (user ID from JWT)
// 1. return 400 if client not logged in
// 2. return 403 if user is not current user
// 3. return 404 if invalid ID
// 5. set remember_digest to nil db (stat code 200)