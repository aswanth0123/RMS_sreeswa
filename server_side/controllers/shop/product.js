import Product from '../../models/productsModels.js';
import PriceChart from '../../models/PriceChartModels.js';
import Shop from '../../models/ShopModels.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    console.log('Fetching products...');
    const products = await Product.find({ status: 'active' })
      .populate('shop', 'shopname location')
      .populate('createdBy', 'username role')
      .populate('priceChart', 'metalType purity ratePerGram ratePerCarat')
      .sort({ createdAt: -1 });

    console.log('Products found:', products.length);
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('shop', 'shopname location')
      .populate('createdBy', 'username role')
      .populate('priceChart', 'metalType purity ratePerGram ratePerCarat');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      description,
      images,
      category,
      metalType,
      purity,
      weight,
      metalColor,
      stoneType,
      stoneWeight,
      stoneCount,
      priceChart,
      makingChargePercent,
      wastagePercent,
      gstPercent,
      fixedCharges,
      shop
    } = req.body;

    // Check if SKU already exists
    if (sku) {
      const existingSku = await Product.findOne({ sku, status: 'active' });
      if (existingSku) {
        return res.status(400).json({
          success: false,
          message: 'SKU already exists'
        });
      }
    }

    // Check if shop exists
    if (shop) {
      const shopExists = await Shop.findById(shop);
      if (!shopExists) {
        return res.status(400).json({
          success: false,
          message: 'Shop not found'
        });
      }
    }

    // Check if price chart exists
    if (priceChart) {
      const priceChartExists = await PriceChart.findById(priceChart);
      if (!priceChartExists) {
        return res.status(400).json({
          success: false,
          message: 'Price chart not found'
        });
      }
    }

    // Generate SKU if not provided
    const productSku = sku || `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log(req.user,'req.user?._id');
    
    // Normalize payload to avoid casting empty strings to ObjectId
    const normalized = {
      name,
      sku: productSku,
      description,
      images: images || [],
      category,
      metalType,
      purity,
      weight,
      metalColor,
      stoneType,
      stoneWeight: stoneWeight || 0,
      stoneCount: stoneCount || 0,
      makingChargePercent: makingChargePercent || 10,
      wastagePercent: wastagePercent || 5,
      gstPercent: gstPercent || 3,
      fixedCharges: fixedCharges || 0,
      createdBy: req.user?._id,
      status: 'active'
    };
    if (priceChart && String(priceChart).trim()) normalized.priceChart = priceChart;
    if (shop && String(shop).trim()) normalized.shop = shop;

    const product = new Product(normalized);

    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('shop', 'shopname location')
      .populate('createdBy', 'username role')
      .populate('priceChart', 'metalType purity ratePerGram ratePerCarat');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    
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
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check SKU uniqueness if being updated
    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const skuExists = await Product.findOne({ 
        sku: updateData.sku, 
        _id: { $ne: id },
        status: 'active' 
      });
      if (skuExists) {
        return res.status(400).json({
          success: false,
          message: 'SKU already exists'
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('shop', 'shopname location')
     .populate('createdBy', 'username role')
     .populate('priceChart', 'metalType purity ratePerGram ratePerCarat');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    
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
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete product (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get products by shop
export const getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    
    const products = await Product.find({ 
      shop: shopId, 
      status: 'active' 
    })
      .populate('shop', 'shopname location')
      .populate('createdBy', 'username role')
      .populate('priceChart', 'metalType purity ratePerGram ratePerCarat')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error('Get products by shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const products = await Product.find({ 
      category, 
      status: 'active' 
    })
      .populate('shop', 'shopname location')
      .populate('createdBy', 'username role')
      .populate('priceChart', 'metalType purity ratePerGram ratePerCarat')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get products by metal type
export const getProductsByMetalType = async (req, res) => {
  try {
    const { metalType } = req.params;
    
    const products = await Product.find({ 
      metalType, 
      status: 'active' 
    })
      .populate('shop', 'shopname location')
      .populate('createdBy', 'username role')
      .populate('priceChart', 'metalType purity ratePerGram ratePerCarat')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error('Get products by metal type error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
