 
import { Schema, model } from 'mongoose';

const ReservationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  numberOfPeople: { type: Number, required: true },
  status: { type: String, default: 'pending' },
});

export default model('Reservation', ReservationSchema);