import bcrypt from "bcrypt";
import userAccountRepo from "../repositories/userAccountRepo.js";
import { SALTROUNDS } from "../../../config/environment.js";
import crypto from "crypto";
import verificationTokenRepo from "../repositories/verificationTokenRepo.js";
import { sendVerificationMail } from "../../../utils/mailjet.js";

const userAccountService = {
    logIn: async (credentials) => {

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
                return {success: true, message: "account created", data: result}
            } else return {success: false, message: "Error sending verification email", error: emailResult.error}
        } catch (error) {
            return {success: false, message: error.message}
        }
    },
    verify: async (token) => {

        return {success: true, message: "just for testing", data: {token: token}}
        //hitta tokenet i databasen

        //dekryptera det och kolla att det inte gått ut

        //hitta motsvarande kontot

        //markera kontot som verifierat

        //skicka svar 200
    }
}

export default userAccountService;