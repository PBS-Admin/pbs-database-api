import { NextRequest } from "next/server";
import { dbPool } from "@/app/db/connection";
import { RowDataPacket } from "mysql2/promise";

interface IEmployee extends RowDataPacket {
    id: number;
    FullName: string;
    Initials: string;
    LogInName: string;
    Territory: string;
    MBSIPermission: number;
    Active: boolean;
}

export async function GET(request: NextRequest) {
    try{
        const[rows] = await dbPool.query<IEmployee[]>('SELECT * FROM Employees');

        console.log(rows);
        
        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
    }catch (err){
        console.error('Query error:', err);
        throw err;
    }
}