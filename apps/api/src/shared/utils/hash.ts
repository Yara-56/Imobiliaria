import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/* ======================================================
   🔐 HASH PASSWORD
====================================================== */

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/* ======================================================
   🔍 COMPARE PASSWORD
====================================================== */

export const comparePassword = async (
  password: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};
