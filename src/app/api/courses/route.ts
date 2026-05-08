import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        const authHeader = req.headers.get("authorization");
        const user = verifyToken(authHeader);

        if (!user){
            return NextResponse.json(
                {message: "Unauthorized"},
                {status: 401}
            );
        }

        if(user.role !== "LECTURER" && user.role !== "ADMIN"){
            return NextResponse.json(
                {message: "Access denied"},
                {status: 403}
            );
        }

        const body = await req.json();
        const { code, title } = body;

        if (!code || !title){
            return NextResponse.json(
                {message: "Course code and title are required"},
                {status: 400}
            );
        }

        const existingCourse = await prisma.course.findUnique({
            where: {
                code,
            },
        });

        if (existingCourse){
            return NextResponse.json(
                {message: "Course code already exists"},
                {status: 400}
            );
        }

        const course = await prisma.course.create({
            data: {
                code,
                title,
                lecturerId: user.id,
            },
        });

        return NextResponse.json(
            {
                message: "Course created successfully", 
                course
            },
            {status: 201}
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {message: "An error occurred while creating the course"},
            {status: 500}
        );
    }
}