import  jwt  from "jsonwebtoken";

export type JwtPayload = {
    id: string;
    email: string;
    identifier: string;
    role: "STUDENT" | "LECTURER" | "ADMIN";
}

export function verifyToken(authHeader: string | null) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try{
        return jwt.verify(
            token, 
            process.env.JWT_SECRET as string
        ) as JwtPayload;
    } catch (error){
        return null;
    }
}