import bcryptjs from 'bcryptjs';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        // db operations
        const hashdedPassword = await bcryptjs.hashSync(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username, email, password: hashdedPassword
            }
        })
        console.log(newUser);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating user' })
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;
    // 首先判断用户是否存在，再判断用户的密码是否正确，如果密码正确生成cookie令牌
    try {
        const user = await prisma.user.findUnique({
            where: { username }
        })
        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Password is incorrect' })
        }

        const { password: userPassword, ...userInfo } = user

        // 令牌时间
        const age = 1000 * 60 * 60 * 24 * 7

        // 生成令牌
        const token = jwt.sign({ id: user.id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: age })

        res.cookie('token', token, {
            httpOnly: true,
            // secure:true,
            maxAge: age
        })
            .status(200)
            .json(userInfo)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error logging in' })
    }
}

export const logout = (req, res) => {
    // db operations
    res.clearCookie('token').status(200).json({ message: 'Logout successfully' })
}