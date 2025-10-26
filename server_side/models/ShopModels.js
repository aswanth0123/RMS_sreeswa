import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopname: {
    type: String,
    required: true,
    trim: true
  },
  place: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  shopid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  openingTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Invalid opening time format (HH:MM)'
    }
  },
  closingTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Invalid closing time format (HH:MM)'
    }
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Phone number must be 10 digits'
    }
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Mobile number must be 10 digits'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  gstin: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
      },
      message: 'Invalid GSTIN format'
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
shopSchema.index({ shopid: 1 });
shopSchema.index({ email: 1 });
shopSchema.index({ gstin: 1 });
shopSchema.index({ user: 1 });
shopSchema.index({ status: 1 });

// Virtual for full address
shopSchema.virtual('fullAddress').get(function() {
  return `${this.place}, ${this.location}`;
});

// Virtual for business hours
shopSchema.virtual('businessHours').get(function() {
  return `${this.openingTime} - ${this.closingTime}`;
});

// Pre-save middleware to validate business hours
shopSchema.pre('save', function(next) {
  if (this.openingTime && this.closingTime) {
    const opening = new Date(`2000-01-01 ${this.openingTime}`);
    const closing = new Date(`2000-01-01 ${this.closingTime}`);
    
    if (opening >= closing) {
      return next(new Error('Closing time must be after opening time'));
    }
  }
  next();
});

// Method to check if shop is currently open
shopSchema.methods.isOpen = function() {
  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  
  return currentTime >= this.openingTime && currentTime <= this.closingTime;
};

// Static method to find shops by location
shopSchema.statics.findByLocation = function(place) {
  return this.find({ place: new RegExp(place, 'i'), isDeleted: false });
};

// Static method to find active shops
shopSchema.statics.findActive = function() {
  return this.find({ status: 'Active', isDeleted: false });
};

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
