 
import User from '../models/user.model';
import Role from '../models/role.model';
import { generateToken } from '../utils/jwt.util';
import { sendVerificationEmail } from '../utils/email.util';

export const registerUser = async (username: string, email: string, password: string, role: string) => {
  const userRole = await Role.findOne({ name: role });
  if (!userRole) throw new Error('Role not found');

  const user = new User({ username, email, password, role: userRole._id });
  await user.save();

  const token = generateToken(user._id);
  await sendVerificationEmail(email, token);

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).populate('role');
  if (!user) throw new Error('User not found');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  if (!user.isVerified) throw new Error('Please verify your email');

  const token = generateToken(user._id);
  return { token, user };
};