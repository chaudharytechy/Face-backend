
// import User from '../models/User.js'; // Adjust path as needed

import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import setTokenCookie from "../common/tokenJwt.js";
export const register = async (req, res) => {
    try {
      const { password, email } = req.body;
  
      const existingUser = await User.findOne({ email }).lean();
      if (existingUser) {
        return res.status(400).json({
          message: "Already existing!"
        });
      }
  
      const hashPassword = await bcrypt.hash(password, 10);
      const data = new User({
        name: {
            firstName: req.body.name.firstName,
            lastName: req.body.name.lastName
        },
        email: email,
        number: req.body.number,
        password: hashPassword,
        friendList: req.body.friendList || [],
        groupList: req.body.groupList || []
      });
  
      await data.save();
  
      const jwtToken = JWT.sign(
        { id: data._id, email: data.email },
        process.env.JWT_SECRET || 'yourSecretKey',
        { expiresIn: '1h' }
      );
  
      // Set cookie directly
      setTokenCookie(res, jwtToken);
  
      res.status(201).json({
        message: "User registered successfully!",
        token: jwtToken,
        user: {
          id: data._id,
          name: data.name,
          email: data.email
        }
      });
  
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        for (let field in error.errors) {
          validationErrors[field] = error.errors[field].message;
        }
        return res.status(400).json({
          message: "Validation failed",
          errors: validationErrors
        });
      }
  
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };


  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }
  
      // Generate token
      const token = JWT.sign(
        { id: user._id, email: user.email },'yourSecretKey'
      );
  
      // Set cookie
      setTokenCookie(res, token);
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error"
      });
    }
  };

export const viewAllUser=async(req,res)=>{
  try {
    console.log("dfhjhjf")
    const data=await User.find()
    res.status(200).json({
      data,
      message:"get successfully !"
    })
  } catch (error) {
    console.error(error);
      res.status(500).json({
        message: "Server error"
      });
  }
}

  export const logout = (req, res) => {
    try {
      res.clearCookie('authToken', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', // optional, for HTTPS
      });
  
      res.status(200).json({
        message: "Logged out successfully"
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error during logout"
      });
    }
  };
  