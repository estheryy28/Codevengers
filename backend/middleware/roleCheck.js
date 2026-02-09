/**
 * Role-based access control middleware
 * Usage: roleCheck(['ADMIN']) or roleCheck(['ADMIN', 'USER'])
 */
const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
        // Check if user exists on request (should be set by auth middleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if user's role is in allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

module.exports = roleCheck;
