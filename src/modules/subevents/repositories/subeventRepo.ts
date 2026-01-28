import Subevent from "../models/subeventModel";
import subeventType from "../../../types/modelTypes/subevent";

const subeventRepo = {
    add: async (subeventData: subeventType) => {
        return await Subevent.create(subeventData);
    },
};

export default subeventRepo;