export const notFound = (req, res, next) => {
    res.status(404).json({
      status: "error",
      message: "Rota não encontrada",
    });
  };
  