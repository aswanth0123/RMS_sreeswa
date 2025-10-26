import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, unique: true },
    description: { type: String },
    images: [{ type: String }],

    category: {
      type: String,
      enum: ["ring", "necklace", "bangle", "earring", "pendant", "chain", "bracelet"],
      required: true,
    },

    // Material Info
    metalType: {
      type: String,
      enum: ["gold", "silver", "diamond", "platinum"],
      required: true,
    },
    purity: { type: String, default: null },
    weight: { 
      type: Number, 
      required: true,
      min: [0, 'Weight must be positive']
    }, // in grams
    metalColor: { type: String, default: "yellow" },
    stoneType: { type: String, default: null },
    stoneWeight: { 
      type: Number, 
      default: 0,
      min: [0, 'Stone weight must be positive']
    },
    stoneCount: { 
      type: Number, 
      default: 0,
      min: [0, 'Stone count must be positive']
    },

    // Pricing Config
    priceChart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PriceChart",
    },
    makingChargePercent: { 
      type: Number, 
      default: 10,
      min: [0, 'Making charge percent must be positive'],
      max: [100, 'Making charge percent cannot exceed 100%']
    },
    wastagePercent: { 
      type: Number, 
      default: 5,
      min: [0, 'Wastage percent must be positive'],
      max: [100, 'Wastage percent cannot exceed 100%']
    },
    gstPercent: { 
      type: Number, 
      default: 3,
      min: [0, 'GST percent must be positive'],
      max: [100, 'GST percent cannot exceed 100%']
    },
    fixedCharges: { 
      type: Number, 
      default: 0,
      min: [0, 'Fixed charges must be positive']
    },

    // Admin / Shop Info
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

// Add indexes for efficient querying
productSchema.index({ shop: 1, status: 1 });
productSchema.index({ category: 1, metalType: 1 });
productSchema.index({ createdBy: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ status: 1 });

// Add validation for stone requirements
productSchema.pre('save', function(next) {
  if (this.stoneType && this.stoneWeight === 0 && this.stoneCount === 0) {
    return next(new Error('Stone type specified but no stone weight or count provided'));
  }
  next();
});

export default mongoose.model("Product", productSchema);
