import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import { AppError } from "../../shared/errors/AppError.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("Não autorizado", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("Usuário não existe", 401));
    }

    req.user = user;
    next();

  } catch (error) {
    next(new AppError("Token inválido", 401));
  }
};

export default protect;
