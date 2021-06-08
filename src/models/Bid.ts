import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BidSchema = new mongoose.Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: [true],
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'NftItem',
    required: [true],
  },
  value: {
    type: String,
    required: [true],
  },
  senderPubKey: {
    type: String,
    required: [true],
  },
  dateCreated: {
    type: Date
  }
});

export default mongoose.models.Bid || mongoose.model('Bid', BidSchema, 'bids');
