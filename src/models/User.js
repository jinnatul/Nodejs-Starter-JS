import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provide your name.'],
  },
  userName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  picture: {
    type: String,
  },
  pictureId: {
    type: String,
  },
  phone: {
    type: String,
  },
  otp: {
    type: String,
    select: false,
  },
  createdAtOTP: {
    type: Date,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: false,
    select: false,
  },
});

// Document middleware
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// get User from email
userSchema.pre('save', function (next) {
  if (this.email) {
    this.userName = this.email.match(/^([^@]*)@/)[1];
  }
  next();
});

userSchema.methods.comparePassword = async (
  candidatePassword,
  userPassword,
) => {
  const result = await bcrypt.compare(candidatePassword, userPassword);
  return result;
};

if (!mongoose.models.User) {
  mongoose.model('User', userSchema);
}

export default mongoose.models.User;
