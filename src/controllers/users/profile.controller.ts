import { Request, Response, NextFunction } from 'express';
import { IUser, UserModel } from '../../model/User.model';
import { sendResponse } from '../../core/helper/helper.service';

import { ProfileService } from '../../services/users/profile.service'

const profileService = new ProfileService();

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const user = req.user as IUser;
  const bodyData = req.body;
  const updatedUser = profileService.updateProfile(user?._id?.toString(), user?.role, bodyData)
  sendResponse(res, 200, 'updated successfully', updatedUser)
  return;
  // const { agencyName, agencyType, firstName, lastName } = req.body;

  // // Validate role-specific updates
  // if (user.role === 'agency' && (firstName || lastName)) {
  //   return res.status(400).json({ message: 'Agency cannot update agent-specific fields' });
  // }
  // if (user.role === 'agent' && (agencyName || agencyType)) {
  //   return res.status(400).json({ message: 'Agent cannot update agency-specific fields' });
  // }

  // const updateData: Partial<IUser> = {};
  // if (agencyName) updateData.agencyName = agencyName;
  // if (agencyType) updateData.agencyType = agencyType;
  // if (firstName) updateData.firstName = firstName;
  // if (lastName) updateData.lastName = lastName;

  // const updatedUser = await UserModel.findByIdAndUpdate(user._id, updateData, { new: true });
  // res.json(updatedUser);
  // sendResponse(res, 200, 'updated successfully', updatedUser)
};

export const updateAdminProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  updateProfile(req, res, next)
}

export const updateAgencyProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  updateProfile(req, res, next)
}

export const updateAgentProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  updateProfile(req, res, next)
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params?.id;
  if (!userId) {
    throw new Error("UserId Required!")
  }
  // const user = req.user as IUser;
  const userData = await UserModel.findById(userId);
  sendResponse(res, 200, 'fetched successfully', userData)
};
