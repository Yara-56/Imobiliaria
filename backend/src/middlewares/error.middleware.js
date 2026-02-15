const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    res.status(statusCode).json({
      success: false,
      message: err.message || "Erro interno do servidor",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  };
  
  export default errorHandler;
  