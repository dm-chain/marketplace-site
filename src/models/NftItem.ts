import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const NftItemSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: [true],
  },
  author: {
    type: String,
    required: [true],
  },
  authorName: {
    type: String,
    required: [true],
  },
  name: {
    type: String,
    required: [true],
    maxlength: [100],
  },
  id: {
    type: String,
    required: [true],
    maxlength: [200],
  },
  url: {
    type: String,
    required: [true],
  },
  type: {
    type: String,
    required: [true],
  },
  offer: {
    type: String,
  },
  description: {
    type: String,
  },
  likes: {
    type: [String],
    default: [],
  },
  dateCreated: {
    type: Date,
  },
  dateModified: {
    type: Date,
  },
  collectionId: {
    type: Schema.Types.ObjectId,
    ref: 'Collection'
  },
  wallet: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet'
  },
  auction: {
    type: Schema.Types.ObjectId,
    ref: 'Auction'
  },
});

export default mongoose.models.NftItem || mongoose.model('NftItem', NftItemSchema, 'items');
