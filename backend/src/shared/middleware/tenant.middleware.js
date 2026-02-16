export const attachTenant = (req, res, next) => {
    if (!req.user?.tenantId) {
      return res.status(403).json({ message: "Tenant not found" });
    }
  
    req.tenantId = req.user.tenantId;
    next();
  };
  