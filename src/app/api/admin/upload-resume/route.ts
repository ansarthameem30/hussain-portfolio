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

    // 1. Save locally to public directory
    const publicPath = path.join(process.cwd(), 'public', fileName);
    await fs.writeFile(publicPath, buffer);

    // 2. If GitHub token is configured, push the PDF to GitHub public/ folder
    let githubPushed = false;
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER || 'ansarthameem30';
    const repo = process.env.GITHUB_REPO || 'hussain-portfolio';
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (token) {
      try {
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

        if (putRes.ok) {
          githubPushed = true;
        }
      } catch (err) {
        console.warn('Failed to push PDF to GitHub API, local save succeeded:', err);
      }
    }

    // 3. Update profile.json with cache-busting timestamp
    const timestamp = Date.now();
    const newResumeUrl = `/${fileName}?v=${timestamp}`;
    const profilePath = path.join(process.cwd(), 'src', 'data', 'content', 'profile.json');
    const rawProfile = await fs.readFile(profilePath, 'utf-8');
    const profileJson = JSON.parse(rawProfile);
    if (!profileJson.contact) profileJson.contact = {};
    profileJson.contact.resumeUrl = newResumeUrl;

    await fs.writeFile(profilePath, JSON.stringify(profileJson, null, 2) + '\n', 'utf-8');

    // Also commit profile.json to GitHub if configured
    if (token) {
      try {
        await githubService.saveFileContent('profile.json', profileJson, 'Update resume URL with timestamp cache bust');
      } catch (e) {
        console.warn('Could not sync profile.json to GitHub after PDF upload:', e);
      }
    }

    return NextResponse.json({
      success: true,
      resumeUrl: newResumeUrl,
      githubPushed,
      message: `Resume PDF (${(file.size / 1024).toFixed(1)} KB) updated successfully!${githubPushed ? ' Pushed to GitHub and triggering Vercel build.' : ''}`,
    });
  } catch (error: any) {
    console.error('Resume upload error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Error uploading resume' }, { status: 500 });
  }
}
