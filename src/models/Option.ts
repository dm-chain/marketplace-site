import mongoose from 'mongoose';

const Option = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
  },
  value: {
    type: String,
    required: [true],
  },
});

export default mongoose.models.Option || mongoose.model('Option', Option, 'options');
