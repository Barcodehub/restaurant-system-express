/// <reference path="../types/express.d.ts" /> // Referencia explícita al archivo de tipos
import { Request, Response, RequestHandler } from 'express';
import User from '../models/user.model';

export const getProfile: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('role'); // req.userId es un ObjectId
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

export const updateProfile: RequestHandler = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.userId, { username, email }, { new: true }); // req.userId es un ObjectId
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

export const changePassword: RequestHandler = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId); // req.userId es un ObjectId
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid old password' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error });
  }
};