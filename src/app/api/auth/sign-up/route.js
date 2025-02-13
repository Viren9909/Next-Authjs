import bcrypt from 'bcrypt'
import User from '@/app/model/User'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/dbconfig';

export async function POST(req) {

    const { email, username, password } = await req.json();

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

        const sameusername = await User.findOne({ username });
        if (sameusername) {
            return NextResponse.json({
                message: "User already exist with same username.",
                success: false
            }, { status: 400 });
        }
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
            password: hashpassword
        });
        await user.save();

        return NextResponse.json({
            message: "Signup Successfull.",
            user: user,
            success: true
        }, { status: 200 });

    } catch (error) {
        console.log("Internal Server Error.");
        return NextResponse.json({
            message: "Internal Server Error.",
            error: error.message,
            success: false
        }, { status: 500 });
    }
}