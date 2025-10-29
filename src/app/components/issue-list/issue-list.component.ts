import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GithubService, PaginationLinks } from '../../services/github.service';
import { ThemeService } from '../../services/theme.service';
import { Issue } from '../../models';

@Component({
  selector: 'app-issue-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.css'
})
export class IssueListComponent implements OnInit {
  issues: Issue[] = [];
  loading = false;
  error: string | null = null;
  
  // Repository info
  owner = 'facebook';
  repo = 'react';
  
  // Filters
  state: 'open' | 'closed' | 'all' = 'open';
  labels = '';
  sort: 'created' | 'updated' | 'comments' = 'created';
  direction: 'asc' | 'desc' = 'desc';
  
  // Pagination
  currentPage = 1;
  perPage = 30;
  paginationLinks: PaginationLinks = {};

  constructor(
    private githubService: GithubService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.loadIssues();
  }

  loadIssues() {
    this.loading = true;
    this.error = null;

    this.githubService
      .getIssues(this.owner, this.repo, {
        state: this.state,
        labels: this.labels || undefined,
        sort: this.sort,
        direction: this.direction,
        page: this.currentPage,
        per_page: this.perPage,
      })
      .subscribe({
        next: ({ issues, links }) => {
          this.issues = issues;
          this.paginationLinks = links;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load issues. Please try again.';
          this.loading = false;
          console.error(err);
        },
      });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadIssues();
  }

  onRepoChange() {
    this.currentPage = 1;
    this.loadIssues();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadIssues();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage() {
    if (this.paginationLinks.next) {
      this.currentPage++;
      this.loadIssues();
    }
  }

  prevPage() {
    if (this.paginationLinks.prev && this.currentPage > 1) {
      this.currentPage--;
      this.loadIssues();
    }
  }

  getStateColor(state: string): string {
    return state === 'open' ? 'text-green-600' : 'text-purple-600';
  }

  getStateIcon(state: string): string {
    return state === 'open' ? '●' : '✓';
  }

  getContrastColor(hexColor: string): string {
    // Calculate luminance and return black or white for best contrast
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

  // Statistics calculations
  get openIssuesCount(): number {
    return this.issues.filter(i => i.state === 'open').length;
  }

  get closedIssuesCount(): number {
    return this.issues.filter(i => i.state === 'closed').length;
  }

  get totalComments(): number {
    return this.issues.reduce((sum, i) => sum + i.comments, 0);
  }

  get averageComments(): number {
    return this.issues.length > 0 ? Math.round(this.totalComments / this.issues.length) : 0;
  }

  get openPercentage(): number {
    return this.issues.length > 0 ? Math.round((this.openIssuesCount / this.issues.length) * 100) : 0;
  }
}

