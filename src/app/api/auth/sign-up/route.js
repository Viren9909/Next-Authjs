import bcrypt from 'bcrypt'
import User from '@/app/model/User'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/dbconfig';

export async function POST(req) {

    const { email, username, password, isAdmin } = await req.json();

    if (!password || !email || !username) {
        return NextResponse.json({
            message: "Provide credential to signIn.",
            success: false,
        }, { status: 400 })
    }
    if (password.length < 6) {
        return NextResponse.json({
            message: "Password length must be 6 character or more.",
            success: false
        }, { status: 400 });
    }

    try {
        await connectDB();

        const sameuseremail = await User.findOne({ email });
        if (sameuseremail) {
            return NextResponse.json({
                message: "User already exist with same email.",
                success: false
            }, { status: 400 });
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashpassword,
            isAdmin
        });
        await user.save();

        return NextResponse.json({
            message: "Signup Successfull.",
            user: {
                username,
                email,
                isAdmin
            },
            success: true
        }, { status: 200 });

    } catch (error) {
        console.error("Internal Server Error.");
        return NextResponse.json({
            message: "Internal Server Error.",
            error: error.message,
            success: false
        }, { status: 500 });
    }
}