import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Issue } from '../models';

interface IssueExplorerDB extends DBSchema {
  issues: {
    key: string; // owner/repo/number
    value: Issue & { cachedAt: number; repoKey: string };
    indexes: { 'by-repo': string }; // owner/repo
  };
}

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dbPromise: Promise<IDBPDatabase<IssueExplorerDB>>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.dbPromise = openDB<IssueExplorerDB>('github-issue-explorer', 1, {
      upgrade(db) {
        const issueStore = db.createObjectStore('issues', { keyPath: 'id' });
        issueStore.createIndex('by-repo', 'repoKey');
      },
    });
  }

  async cacheIssue(owner: string, repo: string, issue: Issue): Promise<void> {
    const db = await this.dbPromise;
    const repoKey = `${owner}/${repo}`;
    await db.put('issues', {
      ...issue,
      cachedAt: Date.now(),
      repoKey
    } as any);
  }

  async cacheIssues(owner: string, repo: string, issues: Issue[]): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('issues', 'readwrite');
    const repoKey = `${owner}/${repo}`;
    
    await Promise.all([
      ...issues.map(issue =>
        tx.store.put({
          ...issue,
          cachedAt: Date.now(),
          repoKey
        } as any)
      ),
      tx.done
    ]);
  }

  async getCachedIssues(owner: string, repo: string): Promise<Issue[] | null> {
    const db = await this.dbPromise;
    const repoKey = `${owner}/${repo}`;
    const allIssues = await db.getAllFromIndex('issues', 'by-repo', repoKey);
    
    if (allIssues.length === 0) return null;
    
    const now = Date.now();
    const validIssues = allIssues.filter(
      issue => now - issue.cachedAt < this.CACHE_DURATION
    );
    
    if (validIssues.length === 0) return null;
    
    return validIssues.map(({ cachedAt, repoKey, ...issue }) => issue as Issue);
  }

  async clearCache(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('issues');
  }
}
