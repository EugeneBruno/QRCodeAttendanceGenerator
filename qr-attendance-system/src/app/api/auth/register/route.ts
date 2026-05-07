import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import  { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" }, 
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" }, 
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "STUDENT",
            }
        });

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                message: "User registered successfully", 
                user: userWithoutPassword,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {message: "An error occured while registering the user"},
            {status: 500}
        );
    }
}