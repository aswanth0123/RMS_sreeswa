import User from '../../models/userModel.js';
import Customer from '../../models/CustomerModels.js';

const signupController = async (req, res) => {
  try {
    const { fullName, email, password, role = 'user' } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const existingUser = await User.findOne({ username: email.toLowerCase() });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const userData = {
      username: email.toLowerCase(),
      password,
      role,
    };

    const user = new User(userData);
    await user.save();

    let customer;
    try {
      const customerData = {
        user: user._id,
        name: fullName || '',
        email: email.toLowerCase(),
      };

      customer = new Customer(customerData);
      await customer.save();
    } catch (customerError) {
      await User.findByIdAndDelete(user._id);
      throw customerError;
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        },
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email
        }
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export default signupController;

