import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const user = verifyToken(authHeader);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { message: "Only students can enroll in courses" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { message: "Course code is required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        code,
      },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: user.id,
        courseId: course.id,
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { message: "Already enrolled in this course" },
        { status: 409 }
      );
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: user.id,
        courseId: course.id,
      },
    });

    return NextResponse.json(
      {
        message: "Enrollment successful",
        enrollment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}