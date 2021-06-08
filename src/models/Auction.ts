import mongoose from 'mongoose';
const Schema = mongoose.Schema;

type TBid = {
  sender: string;
  value: string;
  senderPubKey: string;
}

const AuctionSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: [true],
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'NftItem',
    required: [true],
  },
  startPrice: {
    type: String,
    required: [true],
  },
  contractAddress: {
    type: String,
    required: [true],
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number,
  },
  currentBid: {
    type: String,
  },
  bids: {
    type: [Schema.Types.ObjectId],
    ref: 'Bid',
  }
});

export default mongoose.models.Auction || mongoose.model('Auction', AuctionSchema, 'auctions');
