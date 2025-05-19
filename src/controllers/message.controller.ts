import { Request, Response, NextFunction } from 'express';
import { IMessage, MessageModel } from '../model/Message.model';
import { IUser } from '../model/User.model';

export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { content, recipientId } = req.body;
        const sender = req.user as IUser;
        const message: IMessage = await MessageModel.create({
            sender: sender._id,
            recipient: recipientId,
            content,
        });
        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = req.user as IUser;
        const messages = await MessageModel.find({
            $or: [{ sender: user._id }, { recipient: user._id }],
        });
        res.json(messages);
    } catch (error) {
        next(error);
    }
};