import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
    maxlength: [30],
  },
  id: {
    type: String,
    required: [true],
    maxlength: [50],
  },
  slug: {
    type: String,
    required: [true],
    maxlength: [30],
  },
  email: {
    type: String,
    required: [false],
  },
  bio: {
    type: String,
  },
  image: {
    required: [false],
    type: String,
    maxlength: [100],
  },
  defaultImage: {
    type: String,
    maxlength: [100],
  },
  cover: {
    type: String,
    maxlength: [100],
  },
  extraton: {
    walletAddress: {
      type: String,
    },
    walletPublicKey: {
      type: String,
    },
  },
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema, 'profiles');
