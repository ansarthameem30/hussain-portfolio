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
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image uploaded' }, { status: 400 });
    }

    const lowerName = file.name.toLowerCase();
    const validExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const hasValidExt = validExts.some((ext) => lowerName.endsWith(ext));
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!hasValidExt && !validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPG, PNG, or WebP images are allowed.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = 'headshot.jpg';

    let localSaved = false;
    // 1. Try to save locally (succeeds in local workspace; fails gracefully on Vercel read-only filesystem)
    try {
      const publicPath = path.join(process.cwd(), 'public', fileName);
      await fs.writeFile(publicPath, buffer);
      localSaved = true;
    } catch (fsErr: any) {
      console.warn('Local public/ write skipped (read-only filesystem):', fsErr.message);
    }

    // 2. If GitHub token is configured, push the image directly to GitHub public/ folder
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
        message: `Update About portrait image (${file.name}) via Portfolio Studio`,
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
        throw new Error(errJson.message || `GitHub API error (${putRes.status}): Failed to commit image`);
      }

      githubPushed = true;
    } else if (!localSaved) {
      // Running in read-only Vercel environment with no GITHUB_TOKEN configured
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
    const newHeadshotUrl = `/${fileName}?v=${timestamp}`;

    // Get current profile content safely
    let profileJson: any;
    try {
      const profileResult = await githubService.getFileContent('profile.json');
      profileJson = profileResult.data;
    } catch {
      const profilePath = path.join(process.cwd(), 'src', 'data', 'content', 'profile.json');
      const rawProfile = await fs.readFile(profilePath, 'utf-8');
      profileJson = JSON.parse(rawProfile);
    }

    profileJson.headshot = newHeadshotUrl;

    // Save profile.json locally if writable
    if (localSaved) {
      try {
        const profilePath = path.join(process.cwd(), 'src', 'data', 'content', 'profile.json');
        await fs.writeFile(profilePath, JSON.stringify(profileJson, null, 2) + '\n', 'utf-8');
      } catch (e: any) {
        console.warn('Local profile.json write skipped:', e.message);
      }
    }

    // Commit profile.json to GitHub if token configured
    if (token) {
      await githubService.saveFileContent(
        'profile.json',
        profileJson,
        `Update headshot image URL in profile.json via Portfolio Studio`
      );
    }

    return NextResponse.json({
      success: true,
      url: newHeadshotUrl,
      message: githubPushed
        ? 'Portrait photo committed to GitHub! Vercel is now deploying your updated photo.'
        : 'Portrait photo updated in workspace successfully!',
    });
  } catch (error: any) {
    console.error('Failed to upload image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
