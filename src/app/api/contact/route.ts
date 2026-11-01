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

    // If Web3Forms Access Key is configured, dispatch free email
    const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (web3FormsKey) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: leadRecord.name,
            email: leadRecord.email,
            subject: leadRecord.subject,
            message: leadRecord.message,
            from_name: 'Abdul Malik Portfolio Lead',
          }),
        });
      } catch (e) {
        console.warn('Web3Forms dispatch error:', e);
      }
    }

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
