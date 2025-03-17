import { Request, Response, RequestHandler } from 'express';
import User from '../models/user.model';
import Role from '../models/role.model';
import { generateToken } from '../utils/jwt.util';
import { sendVerificationEmail } from '../utils/email.util';

export const register: RequestHandler = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const userRole = await Role.findOne({ name: role });
    if (!userRole) {
      res.status(400).json({ message: 'Role not found' });
      return;
    }

    const user = new User({ username, email, password, role: userRole._id });
    await user.save();

    const token = generateToken(user._id.toString());
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'User registered, please verify your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    if (!user.isVerified) {
      res.status(400).json({ message: 'Please verify your email' });
      return;
    }

    const token = generateToken(user._id.toString());
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};