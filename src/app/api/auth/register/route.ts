import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import  { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role, matricNumber } = body;

        if (!name || !matricNumber || !email || !password || !role) {
            return NextResponse.json(
                { error: "Missing required fields" }, 
                { status: 400 }
            );
        }

        if (!/^Au/.test(matricNumber)) {
            return NextResponse.json(
                { error: "Invalid Matriculation number format" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { matricNumber }
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
                matricNumber,
                role: role
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
            {message: `error: ${error.message || "Internal Server Error"}`},
            {status: 500}
        );
    }
}
