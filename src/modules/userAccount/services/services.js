import bcrypt from "bcrypt";
import userAccountRepo from "../repositories/userAccountRepo.js";
import { SALTROUNDS } from "../../../config/environment.js";
import crypto from "crypto";
import verificationTokenRepo from "../repositories/verificationTokenRepo.js";
import { sendVerificationMail } from "../../../utils/mailjet.js";

const userAccountService = {
    logIn: async (credentials) => {
        try {

        } catch (error) {
            return {success: false, message: error.message}
        }

    },
    signUp: async (userData) => {
        try {
            //hasha lösenordet och lägg till datum
            userData.hashedPassword = await bcrypt.hash(userData.password, SALTROUNDS);
            userData.registeredAt = Date.now();
            //spara kontot till databasen
            const result = await userAccountRepo.registerUser(userData);
            //generera verifieringstoken och spara det till databasen
            const verificationToken = {
                token: crypto.randomBytes(32).toString("hex"),
                expiresAt: Date.now() + 1000 * 60 * 60 * 24,
                userId: result._id
            };
            await verificationTokenRepo.saveToken(verificationToken);
            //skicka mejl med länk till verifieringsändpunkten med tokenet i
            const emailResult = await sendVerificationMail(userData.email, userData.username, verificationToken.token);
            //svara 200, det skapade kontot och tokenet i databasen
            if (emailResult.success) {
                return {success: true, message: "Account created", data: result}
            } else return {success: false, message: "Error sending verification email", error: emailResult.error}
        } catch (error) {
            return {success: false, message: error.message}
        }
    },
    verify: async (token) => {

        try {
            //hitta tokenet i databasen
            const tokenResult = await verificationTokenRepo.findToken(token);
            if (tokenResult.length === 0) return {success: false, message: "No token found"}
            //dekryptera det och kolla att det inte gått ut - det är inte krypterat!!!!!!!
            const now = Date.now();
            if (now > tokenResult[0].expiresAt) return {success: false, message: "Token expired"} //TODO: skicka ett nytt mejl
            //hitta motsvarande kontot och markera det som verifierat
            const accountResult = await userAccountRepo.verifyUser(tokenResult[0].userId);
            //skicka svar 200
            return {success: true, message: "Account verified", data: accountResult}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }
}

export default userAccountService;