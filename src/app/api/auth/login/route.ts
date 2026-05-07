import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        const body = await req.json();

        const { matricNumber, password } = body;

        if (!matricNumber || !password){
            return NextResponse.json(
                {message: "All fields are required"},
                {status: 400}
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                matricNumber,
            },
        });

        if (!user){
            return NextResponse.json(
                {message: "Invalid matric no or password"},
                {status: 401}
            );
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid){
            return NextResponse.json(
                {message: "Invalid matric no or password"},
                {status: 401}
            );
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is missing");
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            jwtSecret,
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