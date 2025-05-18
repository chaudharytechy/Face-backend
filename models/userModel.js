import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    firstName: {
      type: String,
      required: true,
      minlength: [2, 'First name must be at least 2 characters long'],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [2, 'Last name must be at least 2 characters long'],
    },
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address`,
    },
  },
  number: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [5, 'Password must be at least 5 characters long'],
    trim: true,
  },
 
  friendList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
  }],
 
  groupList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // Assuming you have a Group model
  }],
}, { timestamps: true });


const User = mongoose.model('User', userSchema);


export default User;
