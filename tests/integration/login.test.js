// API/Login

'POST /' // log user in with email and password
// 1. return 400 if request params are invalid
// 2. return 400 if email not in database
// 3. return 400 if password not in database
// 4. create new authToken
// 5. create remember_digest in db
// 6. return JWToken to client (stat code 200)