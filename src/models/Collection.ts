import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
    maxlength: [30],
  },
  slug: {
    type: String,
    required: [true],
    maxlength: [30],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: [true],
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    maxlength: [100],
    required: [true],
  },
  cover: {
    type: String,
    maxlength: [100],
  },
  dateCreated: {
    type: Date
  }
});

export default mongoose.models.Collection || mongoose.model('Collection', CollectionSchema, 'collections');
