import {
  registerUser,
  loginUser,
  generateAccessToken,
  generateRefreshToken,
} from '../services/auth.service.js';

//
// REGISTER
//
export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .status(201)
      .json({
        success: true,
        accessToken,
        user,
      });
  } catch (error) {
    next(error);
  }
};

//
// LOGIN
//
export const login = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .json({
        success: true,
        accessToken,
        user,
      });
  } catch (error) {
    next(error);
  }
};

//
// LOGOUT
//
export const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logout realizado com sucesso' });
};
