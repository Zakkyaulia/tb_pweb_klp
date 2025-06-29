// Middleware untuk memastikan user sudah login
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        // User is authenticated, allow access
        return next();
    } else {
        // User is not authenticated, redirect to login
        return res.redirect('/login');
    }
};

// Middleware untuk memastikan user belum login (guest)
const requireGuest = (req, res, next) => {
    if (req.session && req.session.user) {
        // User is authenticated, redirect away from guest pages (e.g., to dashboard)
        return res.redirect('/request/step1'); 
    } else {
        // User is not authenticated, allow access
        return next();
    }
};

module.exports = { requireAuth, requireGuest }; 