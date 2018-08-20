// Authorization Middleware
// 1. return 401 if no JWT not included
// 2. If valid token and token not expired pass control to next middleware function
// 3. If error, return 400 and pass control to next middleware function

// Admin Middleware (verify admin status)
// 1. If not admin, return 403 and pass control to next middleware function

// Error Middleware (handle misc. express request processing pipeline errors)
// 1. If error, log it with winston, return 500

// ObjectID Validation
// 1. Use the method provided by the joi-object module to validate an ObjectID