import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Credenciais inválidas');
  }

  user.lastLogin = new Date();
  await user.save();

  return user;
};
