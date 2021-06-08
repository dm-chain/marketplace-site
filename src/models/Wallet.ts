import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true],
    maxlength: [66],
  },
  publicKey: {
    type: String,
    required: [true],
    maxlength: [64],
  },
  extratonAddress: {
    type: String,
    required: [true],
    maxlength: [66],
  },
  profileId: {
    type: String,
    required: [true],
    maxlength: [20],
  },
});

export default mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema, 'wallets');
