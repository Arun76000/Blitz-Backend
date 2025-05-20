import { IUser, UserModel } from '../../model/User.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/email'; // Utility for sending emails (assumed)
import { DecodedToken, generateToken, jwtData } from '../../utils/jwt';
import { GET_ENV_VALUES } from '../../config';

export class AuthService {
    // Register a new user (Agency, Agent, or Admin)
    async register(userData: Partial<IUser>): Promise<{ user: IUser; token: string }> {
        const { email, password, role, agencyName, agencyType, firstName, lastName } = userData;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Validate role-specific fields
        if (role === 'agency') {
            if (!agencyName || !agencyType) {
                throw new Error('Agency name and type are required for agency registration');
            }
        } else if (role === 'agent') {
            if (!firstName || !lastName) {
                throw new Error('First name and last name are required for agent registration');
            }
        } else if (role === 'admin') {
            // Optional: Add admin-specific validation (e.g., only certain users can create admins)
        } else {
            throw new Error('Invalid role');
        }

        // Hash password
        // const hashedPassword = await bcrypt.hash(password!, 10);

        // Create new user
        const user = new UserModel({
            email,
            password: password,//hashedPassword,
            role,
            agencyName: role === 'agency' ? agencyName : undefined,
            agencyType: role === 'agency' ? agencyType : undefined,
            firstName: role === 'agent' ? firstName : undefined,
            lastName: role === 'agent' ? lastName : undefined,
            notifications: {
                emailNotifications: true,
                smsNotifications: false,
            },
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            GET_ENV_VALUES('JWT_SECRET') || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        return { user, token };
    }

    // Login user
    async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
        const user = await UserModel.findOne({ email });
        console.log("auth-login:", user)
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const payload: jwtData = { id: user?._id?.toString(), role: user.role, type: 'loggedIn' }
        const token: string = await generateToken(payload)

        return { user, token };
    }

    // Request password reset
    async requestPasswordReset(email: string): Promise<void> {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const payload: jwtData = { id: user._id, role: user.role, type: 'forget-pass' }
        //Generate Token
        const resetToken = generateToken(payload)

        // Send reset email (assumed utility)
        const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: 'flame100622@gmail.com',
            to: user.email,
            subject: 'Password Reset Request',
            html: `Click here to reset your password: ${resetLink}`
        }
        await sendEmail(mailOptions);
    }

    // Reset password
    async resetPassword(token: string, newPassword: string): Promise<void> {
        const { id, role, type }: jwtData = await DecodedToken(token)

        if (type !== 'forget-pass') {
            throw new Error('Invalid Token!')
        }

        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
    }
}