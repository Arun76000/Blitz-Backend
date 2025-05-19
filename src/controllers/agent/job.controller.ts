import { Request, Response, NextFunction } from 'express';
import { IJob, JobModel } from '../../model/Job.model';
import { IUser, UserModel } from '../../model/User.model';
export const applyJob = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = req.user as IUser;
        if (user.role !== 'agent') {
            return res.status(403).json({ message: 'Only agents can apply to jobs' });
        }

        const { jobId } = req.body;
        const job = await JobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await UserModel.updateOne({ _id: user._id }, { $addToSet: { appliedJobs: jobId } });
        res.json({ message: 'Job applied successfully' });
    } catch (error) {
        next(error);
    }
};

export const getAppliedJobs = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = req.user as IUser;
        if (user.role !== 'agent') {
            return res.status(403).json({ message: 'Only agents can view applied jobs' });
        }

        const userData = await UserModel.findById(user._id).populate('appliedJobs');
        res.json(userData?.appliedJobs || []);
    } catch (error) {
        next(error);
    }
};