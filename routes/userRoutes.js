import express from "express"
import { login, logout, register, viewAllUser } from "../controllers/userController.js"
import authication from "../common/authication.js";
const routes=express.Router()

const validate = (req, res, next) => {
    try {
        console.log(req.body)
      const { name, email, number, password } = req.body;
      const errors = {};
  
      // Name checks
      if (!name || typeof name !== 'object') {
        errors.name = 'Name is required and should be an object';
      } else {
        if (!name.firstName || name.firstName.length < 2) {
          errors['name.firstName'] = 'First name must be at least 2 characters long';
        }
        if (!name.lastName || name.lastName.length < 2) {
          errors['name.lastName'] = 'Last name must be at least 2 characters long';
        }
      }
  
      // Email check
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!email || !emailRegex.test(email)) {
        errors.email = 'A valid email is required';
      }
  
      // Number check
      if (!number) {
        errors.number = 'A valid phone number is required';
      }
  
      // Password check
      if (!password || password.length < 5) {
        errors.password = 'Password must be at least 5 characters long';
      }
  
      // If errors exist, return them
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors,
        });
      }
      console.log("he0")
      // If all is good, proceed to controller
      next();
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during validation' });
    }
  };
  
  routes.get('/me', authication, (req, res) => {
    res.json({ user: req.user }); // return logged-in user info
  });
  

routes.post("/register",validate,register)
routes.post("/login",login)
routes.get("/ViewAll",authication,viewAllUser)
routes.post("/logout",logout)


export default routes