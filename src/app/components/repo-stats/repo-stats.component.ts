import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';
import { ThemeService } from '../../services/theme.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-repo-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './repo-stats.component.html',
  styleUrl: './repo-stats.component.css'
})
export class RepoStatsComponent implements OnInit, AfterViewInit {
  @ViewChild('languageChart') languageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('contributorsChart') contributorsCanvas!: ElementRef<HTMLCanvasElement>;

  owner = 'facebook';
  repo = 'react';
  
  repoData: any = null;
  languages: any = {};
  contributors: any[] = [];
  
  loading = false;
  error = '';

  // Computed stats
  stats = {
    stars: 0,
    forks: 0,
    watchers: 0,
    openIssues: 0,
    size: 0,
    contributors: 0
  };

  constructor(
    private githubService: GithubService,
    public theme: ThemeService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawLanguageChart();
      this.drawContributorsChart();
    }, 500);
  }

  loadStats() {
    this.loading = true;
    this.error = '';

    forkJoin({
      repo: this.githubService.getRepoStats(this.owner, this.repo),
      languages: this.githubService.getRepoLanguages(this.owner, this.repo),
      contributors: this.githubService.getContributors(this.owner, this.repo)
    }).subscribe({
      next: ({ repo, languages, contributors }) => {
        this.repoData = repo;
        this.languages = languages;
        this.contributors = contributors.slice(0, 10);

        this.stats = {
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          watchers: repo.watchers_count || 0,
          openIssues: repo.open_issues_count || 0,
          size: repo.size || 0,
          contributors: contributors.length
        };

        this.loading = false;
        setTimeout(() => {
          this.drawLanguageChart();
          this.drawContributorsChart();
        }, 100);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load repository stats';
        this.loading = false;
      }
    });
  }

  drawLanguageChart() {
    if (!this.languageCanvas || Object.keys(this.languages).length === 0) return;

    const canvas = this.languageCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    ctx.clearRect(0, 0, width, height);

    const total = Object.values(this.languages).reduce((a: number, b: any) => a + b, 0);
    const colors = ['#06b6d4', '#22c55e', '#a855f7', '#3b82f6', '#f59e0b', '#ef4444'];
    
    let startAngle = 0;
    Object.entries(this.languages).forEach(([lang, bytes], i) => {
      const sliceAngle = (2 * Math.PI * (bytes as number)) / total;
      
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = this.theme.isDark ? '#1e293b' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle += sliceAngle;
    });
  }

  drawContributorsChart() {
    if (!this.contributorsCanvas || this.contributors.length === 0) return;

    const canvas = this.contributorsCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    const maxContributions = Math.max(...this.contributors.map(c => c.contributions));
    const barWidth = chartWidth / this.contributors.length;

    this.contributors.forEach((contributor, i) => {
      const barHeight = (contributor.contributions / maxContributions) * chartHeight;
      const x = padding + i * barWidth;
      const y = padding + chartHeight - barHeight;

      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0.3)');

      ctx.fillStyle = gradient;
      ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

      ctx.strokeStyle = 'rgba(168, 85, 247, 1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y, barWidth - 4, barHeight);
    });

    ctx.strokeStyle = this.theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  getLanguagePercentage(bytes: number): number {
    const total = Object.values(this.languages).reduce((a: number, b: any) => a + b, 0);
    return Math.round((bytes / total) * 100);
  }

  getLanguageEntries(): { key: string; value: number }[] {
    return Object.entries(this.languages).map(([key, value]) => ({ key, value: value as number }));
  }

  openRepo() {
    if (this.repoData) {
      window.open(this.repoData.html_url, '_blank');
    }
  }
}
