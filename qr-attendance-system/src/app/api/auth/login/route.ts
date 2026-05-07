import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        const body = await req.json();

        const { email, password } = body;

        if (!email || !password){
            return NextResponse.json(
                {message: "All fields are required"},
                {status: 400}
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user){
            return NextResponse.json(
                {message: "Invalid email or password"},
                {status: 401}
            );
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid){
            return NextResponse.json(
                {message: "Invalid email or password"},
                {status: 401}
            );
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d",
            }
        );

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                message: "Login successful",
                user: userWithoutPassword,
                token,
            },
            { status: 200 }
        );

    } catch (error){
        console.log(error);

        return NextResponse.json(
            { message: "An error occurred while logging in the user" },
            { status: 500 }
        );
    }
}