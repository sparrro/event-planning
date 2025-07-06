import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

export const decryptPassword = async (password, comparandum) => {
    await bcrypt.compare()
}