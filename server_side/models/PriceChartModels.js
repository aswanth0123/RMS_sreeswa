import mongoose from "mongoose";

const priceChartSchema = new mongoose.Schema(
  {
    metalType: {
      type: String,
      enum: ["gold", "silver", "diamond", "platinum"],
      required: true,
    },
    purity: {
      type: String,
      default: null, // e.g., 22K, 24K
      enum: [null, "18K", "22K", "24K", "14K", "10K", "916", "750", "585", "375"],
    },
    ratePerGram: {
      type: Number,
      required: true,
      min: [0, 'Rate per gram must be positive'],
    },
    ratePerCarat: {
      type: Number,
      default: null, // for diamonds
      min: [0, 'Rate per carat must be positive'],
    },
    currency: {
      type: String,
      default: "INR",
    },
    unit: {
      type: String,
      default: "gram",
    },
    source: {
      type: String,
      default: "manual",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Add indexes for efficient querying
priceChartSchema.index({ metalType: 1, purity: 1, date: -1 });
priceChartSchema.index({ createdBy: 1 });
priceChartSchema.index({ date: -1 });

// Add validation for diamond pricing
priceChartSchema.pre('save', function(next) {
  if (this.metalType === 'diamond' && !this.ratePerCarat) {
    return next(new Error('Diamond pricing requires ratePerCarat'));
  }
  next();
});

export default mongoose.model("PriceChart", priceChartSchema);
