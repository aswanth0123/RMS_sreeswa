import Shop from '../../models/ShopModels.js';
import User from '../../models/userModel.js';
import bcrypt from 'bcryptjs';

// Get all shops
export const getAllShops = async (req, res) => {
  try {
    console.log('Fetching shops...');
    const shops = await Shop.find({ isDeleted: false })
      .populate('user', 'username role')
      .sort({ createdAt: -1 });

    console.log('Shops found:', shops.length);
    res.status(200).json({
      success: true,
      message: 'Shops retrieved successfully',
      data: shops
    });
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get shop by ID
export const getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const shop = await Shop.findById(id)
      .populate('user', 'username email role');

    if (!shop || shop.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shop retrieved successfully',
      data: shop
    });
  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new shop
export const createShop = async (req, res) => {
  try {
    const {
      shopname,
      place,
      location,
      shopid,
      openingTime,
      closingTime,
      phoneNumber,
      mobile,
      email,
      password,
      gstin
    } = req.body;

    // Check if shop ID already exists
    const existingShopId = await Shop.findOne({ shopid, isDeleted: false });
    if (existingShopId) {
      return res.status(400).json({
        success: false,
        message: 'Shop ID already exists'
      });
    }

    // Check if email already exists in User table
    const existingUserEmail = await User.findOne({ username: email });
    if (existingUserEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Check if GSTIN already exists
    const existingGstin = await Shop.findOne({ gstin, isDeleted: false });
    if (existingGstin) {
      return res.status(400).json({
        success: false,
        message: 'GSTIN already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with role 'shop'
    const user = new User({
      username: email, // Use email as username for login
      password: password,
      role: 'shop'
    });

    await user.save();

    // Create shop
    const shop = new Shop({
      user: user._id,
      shopname,
      place,
      location,
      shopid,
      openingTime,
      closingTime,
      phoneNumber,
      mobile,
      email,
      gstin
    });

    await shop.save();

    const populatedShop = await Shop.findById(shop._id)
      .populate('user', 'username role');

    res.status(201).json({
      success: true,
      message: 'Shop and user created successfully',
      data: populatedShop
    });
  } catch (error) {
    console.error('Create shop error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update shop
export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if shop exists
    const existingShop = await Shop.findById(id);
    if (!existingShop || existingShop.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Check for duplicate shop ID (if being updated)
    if (updateData.shopid && updateData.shopid !== existingShop.shopid) {
      const duplicateShopId = await Shop.findOne({ 
        shopid: updateData.shopid, 
        _id: { $ne: id },
        isDeleted: false 
      });
      if (duplicateShopId) {
        return res.status(400).json({
          success: false,
          message: 'Shop ID already exists'
        });
      }
    }

    // Check for duplicate email (if being updated)
    if (updateData.email && updateData.email !== existingShop.email) {
      const duplicateEmail = await Shop.findOne({ 
        email: updateData.email, 
        _id: { $ne: id },
        isDeleted: false 
      });
      if (duplicateEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Check for duplicate GSTIN (if being updated)
    if (updateData.gstin && updateData.gstin !== existingShop.gstin) {
      const duplicateGstin = await Shop.findOne({ 
        gstin: updateData.gstin, 
        _id: { $ne: id },
        isDeleted: false 
      });
      if (duplicateGstin) {
        return res.status(400).json({
          success: false,
          message: 'GSTIN already exists'
        });
      }
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'username email role');

    res.status(200).json({
      success: true,
      message: 'Shop updated successfully',
      data: updatedShop
    });
  } catch (error) {
    console.error('Update shop error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete shop (soft delete)
export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id);
    if (!shop || shop.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Soft delete
    shop.isDeleted = true;
    await shop.save();

    res.status(200).json({
      success: true,
      message: 'Shop deleted successfully'
    });
  } catch (error) {
    console.error('Delete shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get shops by location
export const getShopsByLocation = async (req, res) => {
  try {
    const { place } = req.query;

    if (!place) {
      return res.status(400).json({
        success: false,
        message: 'Place parameter is required'
      });
    }

    const shops = await Shop.findByLocation(place)
      .populate('user', 'username email role');

    res.status(200).json({
      success: true,
      message: 'Shops retrieved successfully',
      data: shops
    });
  } catch (error) {
    console.error('Get shops by location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get active shops
export const getActiveShops = async (req, res) => {
  try {
    const shops = await Shop.findActive()
      .populate('user', 'username email role');

    res.status(200).json({
      success: true,
      message: 'Active shops retrieved successfully',
      data: shops
    });
  } catch (error) {
    console.error('Get active shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
