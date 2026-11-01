import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, subject } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const leadRecord = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      subject: subject ? String(subject).trim() : 'Portfolio Contact Submission',
      message: String(message).trim(),
      createdAt: new Date(),
      source: 'portfolio-website',
      status: 'new',
    };

    // If MongoDB is configured, persist the lead
    const db = await getDatabase();
    if (db) {
      const collection = db.collection('leads');
      const result = await collection.insertOne(leadRecord);
      return NextResponse.json({
        success: true,
        message: 'Lead saved to database successfully.',
        id: result.insertedId,
      });
    }

    // When MongoDB is not yet connected (e.g. running on static or mock mode)
    return NextResponse.json({
      success: true,
      message: 'Message received successfully (Database ready).',
      mock: true,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing contact form.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Abdul Malik Hussain Portfolio Lead API',
    mongoConfigured: !!process.env.MONGODB_URI,
  });
}
