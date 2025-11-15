import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { GithubService } from './services/github.service';
import { Issue } from './models';
import { ParticleNetwork } from './particle-network';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private particleNetwork: ParticleNetwork | null = null;

  title = 'GitHub Issue Explorer';
  Math = Math; // Expose Math to template

  // UI state
  searchQuery = '';
  sortBy = 'created';
  sortDirection: 'asc' | 'desc' = 'desc';
  filtersOpen = false;
  currentRepo = 'facebook/react'; // Default repo
  loading = false;
  error = '';
  
  // Filtering & Pagination
  filterState: 'all' | 'open' | 'closed' = 'all';
  currentPage = 1;
  itemsPerPage = 10;
  
  // Selected issue for detail view
  selectedIssue: Issue | null = null;

  // Real data from GitHub
  repositories = [
    { name: 'facebook/react', stars: 198000 },
    { name: 'vuejs/vue', stars: 200000 },
    { name: 'angular/angular', stars: 85000 },
    { name: 'microsoft/vscode', stars: 140000 },
    { name: 'tensorflow/tensorflow', stars: 180000 }
  ];

  issues: Issue[] = [];

  // Stats
  stats = {
    total: 0,
    open: 0,
    closed: 0,
    avgComments: 0
  };

  constructor(
    public theme: ThemeService,
    private githubService: GithubService
  ) {}

  ngAfterViewInit() {
    if (this.canvasRef && this.canvasRef.nativeElement) {
      this.particleNetwork = new ParticleNetwork(this.canvasRef.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.particleNetwork) {
      this.particleNetwork.destroy();
    }
  }

  ngOnInit(): void {
    // Force dark mode only
    this.theme.setDarkMode(true);
    this.loadIssues();
  }

  loadIssues(): void {
    const [owner, repo] = this.currentRepo.split('/');
    if (!owner || !repo) {
      this.error = 'Invalid repository format. Use: owner/repo';
      return;
    }

    this.loading = true;
    this.error = '';

    this.githubService.getIssues(owner, repo, {
      state: 'all',
      sort: this.sortBy as any,
      direction: this.sortDirection,
      per_page: 30
    }).subscribe({
      next: ({ issues }) => {
        this.issues = issues;
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load issues. Please check the repository name.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.issues.length;
    this.stats.open = this.issues.filter(i => i.state === 'open').length;
    this.stats.closed = this.issues.filter(i => i.state === 'closed').length;
    this.stats.avgComments = this.issues.length > 0
      ? Math.round(this.issues.reduce((sum, i) => sum + i.comments, 0) / this.issues.length)
      : 0;
  }

  selectRepo(repoName: string): void {
    this.currentRepo = repoName;
    this.loadIssues();
  }

  onSortChange(): void {
    this.loadIssues();
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
    return `${Math.floor(seconds / 31536000)} years ago`;
  }

  // small helpers for template
  shortStars(n: number) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return '' + n;
  }

  getContrastColor(hexColor: string): string {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  // Filter and search functionality
  get filteredIssues(): Issue[] {
    let filtered = this.issues;

    // Filter by state
    if (this.filterState !== 'all') {
      filtered = filtered.filter(issue => issue.state === this.filterState);
    }

    // Search by title or body
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(query) ||
        (issue.body && issue.body.toLowerCase().includes(query))
      );
    }

    return filtered;
  }

  // Pagination
  get paginatedIssues(): Issue[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredIssues.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredIssues.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setFilterState(state: 'all' | 'open' | 'closed'): void {
    this.filterState = state;
    this.currentPage = 1; // Reset to first page
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page when searching
  }

  // Issue detail modal
  openIssueDetail(issue: Issue): void {
    this.selectedIssue = issue;
  }

  closeIssueDetail(): void {
    this.selectedIssue = null;
  }

  openIssueInGithub(issue: Issue): void {
    window.open(issue.html_url, '_blank');
  }
}
