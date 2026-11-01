import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { githubService } from '@/lib/github';
import { validateContent, ContentType } from '@/lib/content';

const FILE_MAP: Record<ContentType, string> = {
  profile: 'profile.json',
  stats: 'stats.json',
  projects: 'projects.json',
  skills: 'skills.json',
  experience: 'experience.json',
  certifications: 'certifications.json',
  workflow: 'workflow.json',
  creative: 'creative.json',
};

export async function GET(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as ContentType;

  if (!type || !FILE_MAP[type]) {
    return NextResponse.json({ success: false, error: 'Invalid content type' }, { status: 400 });
  }

  try {
    const result = await githubService.getFileContent(FILE_MAP[type]);
    return NextResponse.json({
      success: true,
      data: result.data,
      source: result.source,
      githubConnected: githubService.isConfigured(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, data, commitMessage } = body as {
      type: ContentType;
      data: any;
      commitMessage?: string;
    };

    if (!type || !FILE_MAP[type]) {
      return NextResponse.json({ success: false, error: 'Invalid content type' }, { status: 400 });
    }

    // 1. Schema Validation
    const validation = validateContent(type, data);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Content validation failed',
          details: 'error' in validation ? validation.error : 'Validation error',
        },
        { status: 422 }
      );
    }

    // 2. Commit / Save
    const msg = commitMessage || `Update portfolio ${type} content via Admin Dashboard`;
    const result = await githubService.saveFileContent(FILE_MAP[type], validation.data, msg);

    return NextResponse.json({
      success: true,
      result,
      message: `Successfully published ${type} content.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
