import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import University from '@/models/University';

export async function GET() {
    try {
        await dbConnect();
        const universities = await University.find({}).sort({ ranking: 1 });
        return NextResponse.json(universities);
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

        // Support both single university and array for seeding
        if (Array.isArray(data)) {
            const universities = await University.insertMany(data);
            return NextResponse.json(universities, { status: 201 });
        } else {
            const university = await University.create(data);
            return NextResponse.json(university, { status: 201 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        const { id, ...updateData } = body;
        const university = await University.findByIdAndUpdate(id, updateData, { new: true });
        if (!university) {
            return NextResponse.json({ error: 'University not found' }, { status: 404 });
        }
        return NextResponse.json(university);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        await University.findByIdAndDelete(id);
        return NextResponse.json({ message: 'University deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
