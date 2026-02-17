const authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        res.status(403);
        return next(new Error('Acesso negado'));
      }
      next();
    };
  };
  
  export default authorize;
  