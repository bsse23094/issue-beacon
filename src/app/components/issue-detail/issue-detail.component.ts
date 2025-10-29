import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GithubService } from '../../services/github.service';
import { MarkdownService } from '../../services/markdown.service';
import { Issue, IssueComment } from '../../models';

@Component({
  selector: 'app-issue-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './issue-detail.component.html',
  styleUrl: './issue-detail.component.css'
})
export class IssueDetailComponent implements OnInit {
  issue: Issue | null = null;
  comments: IssueComment[] = [];
  loading = false;
  error: string | null = null;
  
  owner = '';
  repo = '';
  issueNumber = 0;
  
  renderedBody: SafeHtml = '';
  renderedComments: Map<number, SafeHtml> = new Map();

  constructor(
    private route: ActivatedRoute,
    private githubService: GithubService,
    private markdownService: MarkdownService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.owner = params['owner'];
      this.repo = params['repo'];
      this.issueNumber = +params['number'];
      this.loadIssue();
    });
  }

  async loadIssue() {
    this.loading = true;
    this.error = null;

    try {
      // Load issue
      this.githubService.getIssue(this.owner, this.repo, this.issueNumber).subscribe({
        next: async (issue) => {
          this.issue = issue;
          
          // Render markdown body
          if (issue.body) {
            const html = await this.markdownService.render(issue.body);
            this.renderedBody = this.sanitizer.bypassSecurityTrustHtml(html);
          }
          
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load issue';
          this.loading = false;
          console.error(err);
        },
      });

      // Load comments
      this.githubService.getIssueComments(this.owner, this.repo, this.issueNumber).subscribe({
        next: async (comments) => {
          this.comments = comments;
          
          // Render markdown for each comment
          for (const comment of comments) {
            const html = await this.markdownService.render(comment.body);
            this.renderedComments.set(comment.id, this.sanitizer.bypassSecurityTrustHtml(html));
          }
        },
        error: (err) => {
          console.error('Failed to load comments:', err);
        },
      });
    } catch (err) {
      this.error = 'An error occurred';
      this.loading = false;
    }
  }

  getStateColor(state: string): string {
    return state === 'open' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800';
  }

  getStateIcon(state: string): string {
    return state === 'open' ? '●' : '✓';
  }

  getContrastColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? '' : 's'} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }

  getRenderedComment(commentId: number): SafeHtml {
    return this.renderedComments.get(commentId) || '';
  }
}

