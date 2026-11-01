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

    // 1. Save locally to public directory
    const publicPath = path.join(process.cwd(), 'public', fileName);
    await fs.writeFile(publicPath, buffer);

    // 2. If GitHub token is configured, push the image to GitHub public/ folder
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

        if (putRes.ok) {
          githubPushed = true;
        }
      } catch (err) {
        console.warn('Failed to push image to GitHub API, local save succeeded:', err);
      }
    }

    // 3. Update profile.json with cache-busting timestamp
    const timestamp = Date.now();
    const newHeadshotUrl = `/${fileName}?v=${timestamp}`;
    const profilePath = path.join(process.cwd(), 'src', 'data', 'content', 'profile.json');
    const rawProfile = await fs.readFile(profilePath, 'utf-8');
    const profileJson = JSON.parse(rawProfile);
    profileJson.headshot = newHeadshotUrl;

    await fs.writeFile(profilePath, JSON.stringify(profileJson, null, 2) + '\n', 'utf-8');

    // Also commit profile.json to GitHub if configured
    if (token) {
      try {
        await githubService.saveFileContent(
          'profile.json',
          profileJson,
          `Update headshot image URL in profile.json via Portfolio Studio`
        );
      } catch (err) {
        console.warn('Failed to commit profile.json to GitHub API:', err);
      }
    }

    return NextResponse.json({
      success: true,
      url: newHeadshotUrl,
      message: githubPushed
        ? 'Portrait photo updated locally and committed to GitHub (triggers production build)!'
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
