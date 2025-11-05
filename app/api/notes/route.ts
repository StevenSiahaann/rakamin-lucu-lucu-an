import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const notes = await db
      .collection("notes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Note text is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const newNote = {
      text: text,
      createdAt: new Date(),
    };

    const result = await db.collection("notes").insertOne(newNote);
    return NextResponse.json({ success: true, data: newNote }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
