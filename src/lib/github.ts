import fs from 'fs/promises';
import path from 'path';

export class GitHubService {
  private owner: string;
  private repo: string;
  private branch: string;
  private token: string | undefined;

  constructor() {
    this.owner = process.env.GITHUB_OWNER || 'ansarthameem30';
    this.repo = process.env.GITHUB_REPO || 'hussain-portfolio';
    this.branch = process.env.GITHUB_BRANCH || 'main';
    this.token = process.env.GITHUB_TOKEN;
  }

  public isConfigured(): boolean {
    return Boolean(this.token);
  }

  /**
   * Reads a JSON content file either from GitHub API or local file system fallback
   * @param fileName e.g. "profile.json"
   */
  async getFileContent(fileName: string): Promise<{ data: any; sha?: string; source: 'github' | 'local' }> {
    const gitHubPath = `portfolio-source/src/data/content/${fileName}`;

    // If GitHub Token is configured, fetch from GitHub
    if (this.token) {
      try {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${gitHubPath}?ref=${this.branch}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Hussain-Portfolio-Admin',
          },
          cache: 'no-store',
        });

        if (res.ok) {
          const body = await res.json();
          const decoded = Buffer.from(body.content, 'base64').toString('utf-8');
          return {
            data: JSON.parse(decoded),
            sha: body.sha,
            source: 'github',
          };
        }
      } catch (err) {
        console.warn('GitHub API fetch failed, falling back to local disk:', err);
      }
    }

    // Local disk fallback statically scoped to src/data/content
    const localPath = path.join(process.cwd(), 'src', 'data', 'content', fileName);
    const raw = await fs.readFile(localPath, 'utf-8');
    return {
      data: JSON.parse(raw),
      source: 'local',
    };
  }

  /**
   * Updates or commits a file to GitHub or local disk
   * @param fileName e.g. "profile.json"
   */
  async saveFileContent(
    fileName: string,
    jsonData: any,
    commitMessage: string
  ): Promise<{ success: boolean; sha?: string; destination: 'github' | 'local'; message: string }> {
    const gitHubPath = `portfolio-source/src/data/content/${fileName}`;
    const formattedContent = JSON.stringify(jsonData, null, 2) + '\n';

    // If GitHub Token is configured, commit via GitHub API
    if (this.token) {
      try {
        // First get current file SHA if exists
        const getUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${gitHubPath}?ref=${this.branch}`;
        const getRes = await fetch(getUrl, {
          headers: {
            Authorization: `Bearer ${this.token}`,
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

        const putUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${gitHubPath}`;
        const payload: Record<string, any> = {
          message: commitMessage,
          content: Buffer.from(formattedContent).toString('base64'),
          branch: this.branch,
        };

        if (currentSha) {
          payload.sha = currentSha;
        }

        const putRes = await fetch(putUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Hussain-Portfolio-Admin',
          },
          body: JSON.stringify(payload),
        });

        if (!putRes.ok) {
          const errData = await putRes.json();
          throw new Error(errData.message || 'GitHub commit failed');
        }

        const commitResult = await putRes.json();
        return {
          success: true,
          sha: commitResult.content?.sha,
          destination: 'github',
          message: `Committed directly to GitHub (${this.branch})`,
        };
      } catch (err: any) {
        console.error('Failed to commit to GitHub API:', err);
        throw err;
      }
    }

    // Local disk update fallback
    const localPath = path.join(process.cwd(), 'src', 'data', 'content', fileName);
    await fs.writeFile(localPath, formattedContent, 'utf-8');

    return {
      success: true,
      destination: 'local',
      message: 'Saved to local workspace JSON (GITHUB_TOKEN not provided).',
    };
  }
}

export const githubService = new GitHubService();
