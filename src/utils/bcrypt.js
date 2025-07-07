import bcrypt from "bcrypt";
import { SALTROUNDS } from "../config";


export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALTROUNDS);
}

export const decryptPassword = async (password, comparandum) => {
    await bcrypt.compare()
}