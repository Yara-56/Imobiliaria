const notFound = (req, res, next) => {
    const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  export default notFound;
  