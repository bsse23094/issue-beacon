import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';
import { ThemeService } from '../../services/theme.service';

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author?: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

interface CommitStats {
  date: string;
  count: number;
}

@Component({
  selector: 'app-user-commits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-commits.component.html',
  styleUrl: './user-commits.component.css'
})
export class UserCommitsComponent implements OnInit, AfterViewInit {
  @ViewChild('commitChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('frequencyChart') frequencyCanvas!: ElementRef<HTMLCanvasElement>;

  username = 'torvalds';
  repo = 'linux';
  commits: Commit[] = [];
  commitStats: CommitStats[] = [];
  loading = false;
  error = '';

  // Stats
  stats = {
    totalCommits: 0,
    thisWeek: 0,
    thisMonth: 0,
    avgPerDay: 0
  };

  // Filters
  timeRange: 'week' | 'month' | 'year' = 'month';

  constructor(
    private githubService: GithubService,
    public theme: ThemeService
  ) {}

  ngOnInit() {
    this.loadCommits();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawChart();
      this.drawFrequencyChart();
    }, 500);
  }

  loadCommits() {
    this.loading = true;
    this.error = '';

    const [owner, repoName] = `${this.username}/${this.repo}`.split('/');
    
    this.githubService.getCommits(owner, repoName).subscribe({
      next: (commits: any[]) => {
        this.commits = commits.slice(0, 50);
        this.processCommitStats();
        this.loading = false;
        setTimeout(() => {
          this.drawChart();
          this.drawFrequencyChart();
        }, 100);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load commits';
        this.loading = false;
      }
    });
  }

  processCommitStats() {
    this.stats.totalCommits = this.commits.length;
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    this.stats.thisWeek = this.commits.filter(c => 
      new Date(c.commit.author.date) > weekAgo
    ).length;

    this.stats.thisMonth = this.commits.filter(c => 
      new Date(c.commit.author.date) > monthAgo
    ).length;

    this.stats.avgPerDay = Math.round(this.stats.thisMonth / 30 * 10) / 10;

    // Group by date
    const dateMap = new Map<string, number>();
    this.commits.forEach(commit => {
      const date = new Date(commit.commit.author.date).toLocaleDateString();
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    this.commitStats = Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);
  }

  drawChart() {
    if (!this.chartCanvas || !this.commitStats.length) return;

    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (this.commitStats.length === 0) return;

    const maxCount = Math.max(...this.commitStats.map(s => s.count), 1);
    const barWidth = chartWidth / this.commitStats.length;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Draw sleek bars with glow
    this.commitStats.forEach((stat, i) => {
      const barHeight = (stat.count / maxCount) * chartHeight;
      const x = padding + i * barWidth;
      const y = padding + chartHeight - barHeight;
      const actualBarWidth = Math.max(barWidth - 6, 2);

      // Shadow/Glow effect
      ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
      ctx.shadowBlur = 10;

      // Gradient fill - sleeker colors
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.9)');
      gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.7)');
      gradient.addColorStop(1, 'rgba(8, 145, 178, 0.5)');

      ctx.fillStyle = gradient;
      
      // Rounded rectangle bar
      const radius = 3;
      ctx.beginPath();
      ctx.moveTo(x + 3 + radius, y);
      ctx.lineTo(x + 3 + actualBarWidth - radius, y);
      ctx.quadraticCurveTo(x + 3 + actualBarWidth, y, x + 3 + actualBarWidth, y + radius);
      ctx.lineTo(x + 3 + actualBarWidth, y + barHeight);
      ctx.lineTo(x + 3, y + barHeight);
      ctx.lineTo(x + 3, y + radius);
      ctx.quadraticCurveTo(x + 3, y, x + 3 + radius, y);
      ctx.closePath();
      ctx.fill();

      // Remove shadow for axis
      ctx.shadowBlur = 0;
    });

    // Draw axes
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '11px "DM Sans", sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxCount / 5) * (5 - i));
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

    // X-axis label
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.font = '10px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Days', width / 2, height - 10);
  }

  drawFrequencyChart() {
    if (!this.frequencyCanvas || !this.commits.length) return;

    const canvas = this.frequencyCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate hourly distribution
    const hourCounts = new Array(24).fill(0);
    this.commits.forEach(commit => {
      const hour = new Date(commit.commit.author.date).getHours();
      hourCounts[hour]++;
    });

    const maxHourCount = Math.max(...hourCounts, 1);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - padding;

    // Draw circular heatmap
    const angleStep = (Math.PI * 2) / 24;
    
    hourCounts.forEach((count, hour) => {
      const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2;
      const nextAngle = ((hour + 1) / 24) * Math.PI * 2 - Math.PI / 2;
      const intensity = count / maxHourCount;

      // Color based on intensity
      const hue = 180 + intensity * 60; // Cyan to purple
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${0.3 + intensity * 0.7})`;
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 1)`;
      ctx.lineWidth = 1;

      // Draw arc segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, nextAngle);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Add hour labels for key hours
      if (hour % 6 === 0) {
        const labelAngle = angle + angleStep / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
        
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '11px "DM Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${hour}:00`, labelX, labelY);
      }
    });

    // Center label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px "Lexend Deca", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('24h', centerX, centerY - 5);
    ctx.font = '10px "DM Sans", sans-serif';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Distribution', centerX, centerY + 10);
  }

  getRelativeTime(date: string): string {
    const now = new Date();
    const commitDate = new Date(date);
    const diffMs = now.getTime() - commitDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return commitDate.toLocaleDateString();
  }

  openCommit(commit: Commit) {
    window.open(commit.html_url, '_blank');
  }
}
