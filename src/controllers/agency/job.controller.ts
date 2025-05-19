import { Request, Response, NextFunction } from 'express';
import { IJob, JobModel } from '../../model/Job.model';
import { IUser, UserModel } from '../../model/User.model';

export const postJob = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    try {
        const user = req.user as IUser;
        if (user.role !== 'agency') {
            return res.status(403).json({ message: 'Only agencies can post jobs' });
        }

        const jobData: Partial<IJob> = {
            ...req.body,
            agency: user._id,
            status: 'pending',
        };

        const job = await JobModel.create(jobData);
        await UserModel.updateOne({ _id: user._id }, { $addToSet: { postedJobs: job._id } });
        res.status(201).json(job);
    } catch (error) {
        next(error);
    }
};

export const getJobs = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    try {
        const user = req.user as IUser;
        if (user.role !== 'agency') {
            return res.status(403).json({ message: 'Only agencies can view their jobs' });
        }

        const jobs = await JobModel.find({ agency: user._id });
        res.json(jobs);
    } catch (error) {
        next(error);
    }
};