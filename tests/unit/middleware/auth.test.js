// Authorization Middleware
// 1. return 401 if no JWT not included
// 2. If valid token and token not expired pass control to next middleware function
// 3. If error, return 400 and pass control to next middleware function
