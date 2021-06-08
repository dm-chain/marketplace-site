import mongoose from 'mongoose';

const DirectOfferSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: [true],
  },
  item: {
    type: String,
    required: [true],
  },
  price: {
    type: String,
    required: [true],
  },
  totalPrice: {
    type: String,
    required: [true],
  },
  contractAddress: {
    type: String,
    required: [true],
  },
  dateCreated: {
    type: Date,
  },
  dateExpired: {
    type: Date,
  },
  dateClosed: {
    type: Date,
  },
  status: {
    type: String,
  },
});

export default mongoose.models.DirectOffer || mongoose.model('DirectOffer', DirectOfferSchema, 'direct-offers');
