import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;

