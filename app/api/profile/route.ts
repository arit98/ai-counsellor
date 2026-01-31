import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "UserId is required" }, { status: 400 });
        }

        const profile = await Profile.findOne({ userId });
        return NextResponse.json(profile || {});
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        let data;
        try {
            data = await req.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        if (!data.userId) {
            return NextResponse.json({ error: "UserId is required" }, { status: 400 });
        }

        const profile = await Profile.findOneAndUpdate(
            { userId: data.userId },
            data,
            { new: true, upsert: true }
        );

        return NextResponse.json(profile, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
