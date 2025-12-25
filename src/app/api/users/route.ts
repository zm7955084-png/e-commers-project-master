import { NextResponse } from "next/server"
//prisma=>need to learn to know how to handel with data base
export async function GET() {
    const users={
        message:'success', 
       users: [
        {
        name:'mahmoud',
        age:20,
        id:8805
    },
        {
        name:'ali',
        age:23,
        id:88
    },
        {
        name:'ahmed',
        age:30,
        id:88055
    }
]}


return NextResponse.json(users)
}