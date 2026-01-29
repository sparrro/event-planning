import subeventType from "../../../types/modelTypes/subevent";
import subeventCreationInputData from "../../../types/subeventInputData";
import eventRepo from "../../events/repositories/eventRepo";
import subeventRepo from "../repositories/subeventRepo";

const subeventService = {

    add: async (input: subeventCreationInputData) => {
        try {
            const subeventData: subeventType = {
                ...input,
                participants: [input.userId]
            }
            const subevent = await subeventRepo.add(subeventData);
            return { success: true, message: "Subevent added", data: { subevent } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        }
    },

};

export default subeventService;