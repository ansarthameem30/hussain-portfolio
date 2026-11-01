import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { githubService } from '@/lib/github';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Only PDF documents are allowed' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = 'Abdul-Malik-Hussain-Performance-Marketing.pdf';

    let localSaved = false;
    // 1. Try to save locally to public directory (succeeds locally; fails gracefully on Vercel read-only filesystem)
    try {
      const publicPath = path.join(process.cwd(), 'public', fileName);
      await fs.writeFile(publicPath, buffer);
      localSaved = true;
    } catch (fsErr: any) {
      console.warn('Local public/ resume write skipped (read-only filesystem):', fsErr.message);
    }

    // 2. If GitHub token is configured, push the PDF directly to GitHub public/ folder
    let githubPushed = false;
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER || 'ansarthameem30';
    const repo = process.env.GITHUB_REPO || 'hussain-portfolio';
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (token) {
      const gitHubPath = `public/${fileName}`;
      const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${gitHubPath}?ref=${branch}`;
      const getRes = await fetch(getUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Hussain-Portfolio-Admin',
        },
        cache: 'no-store',
      });

      let currentSha: string | undefined;
      if (getRes.ok) {
        const data = await getRes.json();
        currentSha = data.sha;
      }

      const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${gitHubPath}`;
      const payload: Record<string, any> = {
        message: `Update resume PDF (${file.name}) via Portfolio Studio`,
        content: buffer.toString('base64'),
        branch,
      };

      if (currentSha) {
        payload.sha = currentSha;
      }

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Hussain-Portfolio-Admin',
        },
        body: JSON.stringify(payload),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(errJson.message || `GitHub API error (${putRes.status}): Failed to commit resume PDF`);
      }

      githubPushed = true;
    } else if (!localSaved) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Vercel Serverless environment has a read-only filesystem (EROFS). Please add GITHUB_TOKEN to your Vercel Project Settings (Settings > Environment Variables) with a GitHub Personal Access Token (repo scope) so uploads can be committed to your repository.',
        },
        { status: 400 }
      );
    }

    // 3. Update profile.json with cache-busting timestamp
    const timestamp = Date.now();
    const newResumeUrl = `/${fileName}?v=${timestamp}`;

    let profileJson: any;
    try {
      const profileResult = await githubService.getFileContent('profile.json');
      profileJson = profileResult.data;
    } catch {
      const profilePath = path.join(process.cwd(), 'src', 'data', 'content', 'profile.json');
      const rawProfile = await fs.readFile(profilePath, 'utf-8');
      profileJson = JSON.parse(rawProfile);
    }

    if (!profileJson.contact) profileJson.contact = {};
    profileJson.contact.resumeUrl = newResumeUrl;

    if (localSaved) {
      try {
        const profilePath = path.join(process.cwd(), 'src', 'data', 'content', 'profile.json');
        await fs.writeFile(profilePath, JSON.stringify(profileJson, null, 2) + '\n', 'utf-8');
      } catch (e: any) {
        console.warn('Local profile.json write skipped:', e.message);
      }
    }

    if (token) {
      await githubService.saveFileContent('profile.json', profileJson, 'Update resume URL with timestamp cache bust');
    }

    return NextResponse.json({
      success: true,
      resumeUrl: newResumeUrl,
      githubPushed,
      message: `Resume PDF (${(file.size / 1024).toFixed(1)} KB) updated successfully!${githubPushed ? ' Pushed to GitHub and triggering Vercel build.' : ''}`,
    });
  } catch (error: any) {
    console.error('Failed to upload resume:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
