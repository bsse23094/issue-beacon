import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Issue, IssueComment } from '../models';
import { DbService } from './db.service';

export interface PaginationLinks {
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly baseUrl = environment.githubApiBase;

  constructor(
    private http: HttpClient,
    private db: DbService
  ) {}

  /**
   * Fetch issues for a repository with optional filters
   */
  getIssues(
    owner: string,
    repo: string,
    options: {
      state?: 'open' | 'closed' | 'all';
      labels?: string;
      sort?: 'created' | 'updated' | 'comments';
      direction?: 'asc' | 'desc';
      page?: number;
      per_page?: number;
    } = {}
  ): Observable<{ issues: Issue[]; links: PaginationLinks }> {
    let params = new HttpParams();
    
    if (options.state) params = params.set('state', options.state);
    if (options.labels) params = params.set('labels', options.labels);
    if (options.sort) params = params.set('sort', options.sort);
    if (options.direction) params = params.set('direction', options.direction);
    if (options.page) params = params.set('page', options.page.toString());
    if (options.per_page) params = params.set('per_page', options.per_page.toString());

    const url = `${this.baseUrl}/repos/${owner}/${repo}/issues`;

    return this.http.get<Issue[]>(url, { params, observe: 'response' }).pipe(
      map((response: HttpResponse<Issue[]>) => ({
        issues: response.body || [],
        links: this.parseLinkHeader(response.headers.get('Link'))
      })),
      tap(({ issues }) => {
        // Cache issues in IndexedDB
        if (issues.length > 0) {
          this.db.cacheIssues(owner, repo, issues).catch(console.error);
        }
      }),
      catchError(error => {
        console.error('Error fetching issues:', error);
        // Try to return cached data on error
        return this.getCachedIssues(owner, repo);
      })
    );
  }

  /**
   * Get a single issue by number
   */
  getIssue(owner: string, repo: string, issueNumber: number): Observable<Issue> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/issues/${issueNumber}`;
    
    return this.http.get<Issue>(url).pipe(
      tap(issue => {
        this.db.cacheIssue(owner, repo, issue).catch(console.error);
      }),
      catchError(error => {
        console.error('Error fetching issue:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get comments for an issue
   */
  getIssueComments(owner: string, repo: string, issueNumber: number): Observable<IssueComment[]> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
    
    return this.http.get<IssueComment[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching comments:', error);
        return of([]);
      })
    );
  }

  /**
   * Render markdown using GitHub API (optional, can be replaced with client-side)
   */
  renderMarkdown(text: string): Observable<string> {
    const url = `${this.baseUrl}/markdown`;
    
    return this.http.post(url, { text, mode: 'gfm' }, { responseType: 'text' }).pipe(
      catchError(() => of(text)) // Fallback to raw text
    );
  }

  /**
   * Get cached issues from IndexedDB
   */
  private getCachedIssues(owner: string, repo: string): Observable<{ issues: Issue[]; links: PaginationLinks }> {
    return new Observable(observer => {
      this.db.getCachedIssues(owner, repo).then(cached => {
        if (cached) {
          observer.next({ issues: cached, links: {} });
          observer.complete();
        } else {
          observer.error(new Error('No cached data available'));
        }
      }).catch(error => observer.error(error));
    });
  }

  /**
   * Parse GitHub's Link header for pagination
   */
  private parseLinkHeader(linkHeader: string | null): PaginationLinks {
    if (!linkHeader) return {};

    const links: PaginationLinks = {};
    const parts = linkHeader.split(',');

    parts.forEach(part => {
      const section = part.split(';');
      if (section.length !== 2) return;

      const url = section[0].replace(/<(.*)>/, '$1').trim();
      const name = section[1].replace(/rel="(.*)"/, '$1').trim();

      links[name as keyof PaginationLinks] = url;
    });

    return links;
  }
}
