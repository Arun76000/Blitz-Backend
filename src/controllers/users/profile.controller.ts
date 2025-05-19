import { Request, Response, NextFunction } from 'express';
import { IUser, UserModel } from '../../model/User.model';

export const updateProfile = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const user = req.user as IUser;
    const { agencyName, agencyType, firstName, lastName } = req.body;

    // Validate role-specific updates
    if (user.role === 'agency' && (firstName || lastName)) {
      return res.status(400).json({ message: 'Agency cannot update agent-specific fields' });
    }
    if (user.role === 'agent' && (agencyName || agencyType)) {
      return res.status(400).json({ message: 'Agent cannot update agency-specific fields' });
    }

    const updateData: Partial<IUser> = {};
    if (agencyName) updateData.agencyName = agencyName;
    if (agencyType) updateData.agencyType = agencyType;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    const updatedUser = await UserModel.findByIdAndUpdate(user._id, updateData, { new: true });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    const userData = await UserModel.findById(user._id);
    res.json(userData);
  } catch (error) {
    next(error);
  }
};