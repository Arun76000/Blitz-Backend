import { Request, Response, NextFunction } from 'express';
import { IJob, JobModel } from '../../model/Job.model';
import { IUser, UserModel  } from '../../model/User.model';

export const approveJob = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const user = req.user as IUser;
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can approve jobs' });
    }

    const { jobId } = req.params;
    const job = await JobModel.findByIdAndUpdate(
      jobId,
      { status: 'approved' },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
};

export const getPendingJobs = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const user = req.user as IUser;
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view pending jobs' });
    }

    const jobs = await JobModel.find({ status: 'pending' }).populate('agency');
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};