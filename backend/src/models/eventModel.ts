import mongoose, { PopulatedDoc } from "mongoose";
import Event from "./interfaces/event";
import User from "./interfaces/user";

export interface EventDocument extends Document, Event {
    user?: PopulatedDoc<User & Document>
}

const eventSchema = new mongoose.Schema({
    eventTitle: {
        type: String,
        required: [true, "missing required field name"]
    },
    description: {
        type: String,
        required: false
    },
    address: {
        type: {
            street: String,
            civicNumber: String,
            city: String,
            coordinates: {
                x: Number,
                y: Number
            }
        },
        required: [true, "missing required field address"]
    },
    date: {
        type: Date,
        required: [true, "missing required field date"],
        // validate: {
        //     validator(this: EventDocument, expirationDate: Date): Boolean {
        //         return new Date() < expirationDate
        //     },
        //     message: "Cannot create event in the past"
        // }
    },
    ownerVolunteerId: {
        type: mongoose.Types.ObjectId,
        required: [true, "missing required field ownerVolunteerId"],
        ref: "User"
    }
})

export default mongoose.model<EventDocument>('Event', eventSchema)