import eventType from "../../../types/modelTypes/event";
import Event from "../models/eventModel";

const eventRepo = {
    create: async (eventData: eventType) => {
        return await Event.create(eventData);
    },
};

export default eventRepo;