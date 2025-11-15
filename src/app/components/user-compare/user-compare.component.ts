import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

interface UserCompareStats {
  profile: any;
  totals: {
    stars: number;
    forks: number;
    watchers: number;
    repoCount: number;
    languages: Record<string, number>;
    recentCommits: number;
  };
  topLanguages: Array<{ name: string; value: number; percentage: number; color: string }>;
  topRepos: Array<{ name: string; stargazers: number; forks: number; url: string; language: string | null }>;
  impactScore: number;
}

type UserSlot = 'a' | 'b';
type ComparisonMetric = 'followers' | 'publicRepos' | 'stars' | 'recentCommits' | 'impactScore';

@Component({
  selector: 'app-user-compare',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-compare.component.html',
  styleUrl: './user-compare.component.css'
})
export class UserCompareComponent {
  userA = 'torvalds';
  userB = 'gaearon';
  loading = false;
  error: string | null = null;
  compareOrder: UserSlot[] = ['a', 'b'];

  results: Record<UserSlot, UserCompareStats | null> = {
    a: null,
    b: null
  };

  comparisonMetrics: { key: ComparisonMetric; label: string }[] = [
    { key: 'followers', label: 'Followers' },
    { key: 'publicRepos', label: 'Public Repositories' },
    { key: 'stars', label: 'Repository Stars' },
    { key: 'recentCommits', label: 'Recent Commits' },
    { key: 'impactScore', label: 'Impact Score' }
  ];

  languageColors = ['#06b6d4', '#a855f7', '#22c55e', '#f97316', '#eab308'];

  constructor(private github: GithubService) {}

  compareUsers(): void {
    const first = this.userA.trim();
    const second = this.userB.trim();

    if (!first || !second) {
      this.error = 'Enter two GitHub usernames to compare.';
      return;
    }

    if (first.toLowerCase() === second.toLowerCase()) {
      this.error = 'Please provide two different usernames.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.results = { a: null, b: null };

    forkJoin({
      a: this.buildUserSnapshot(first),
      b: this.buildUserSnapshot(second)
    }).subscribe({
      next: (payload) => {
        this.results = payload;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Unable to compare users right now.';
        this.loading = false;
      }
    });
  }

  swapUsers(): void {
    const temp = this.userA;
    this.userA = this.userB;
    this.userB = temp;
  }

  hasResults(): boolean {
    return Boolean(this.results.a && this.results.b);
  }

  getMetricValue(slot: UserSlot, metric: ComparisonMetric): number {
    const data = this.results[slot];
    if (!data) return 0;

    switch (metric) {
      case 'followers':
        return data.profile.followers || 0;
      case 'publicRepos':
        return data.profile.public_repos || 0;
      case 'stars':
        return data.totals.stars;
      case 'recentCommits':
        return data.totals.recentCommits;
      case 'impactScore':
        return data.impactScore;
      default:
        return 0;
    }
  }

  isLeader(slot: UserSlot, metric: ComparisonMetric): boolean {
    const otherSlot: UserSlot = slot === 'a' ? 'b' : 'a';
    return this.getMetricValue(slot, metric) >= this.getMetricValue(otherSlot, metric);
  }

  getMetricDelta(metric: ComparisonMetric): number {
    if (!this.hasResults()) return 0;
    return Math.abs(this.getMetricValue('a', metric) - this.getMetricValue('b', metric));
  }

  getDominantLanguage(slot: UserSlot): string {
    const user = this.results[slot];
    if (!user || user.topLanguages.length === 0) return 'No data';
    const top = user.topLanguages[0];
    return `${top.name} • ${top.percentage}%`;
  }

  getLanguageColor(index: number): string {
    return this.languageColors[index % this.languageColors.length];
  }

  private buildUserSnapshot(username: string) {
    return forkJoin({
      profile: this.github.getUser(username),
      repos: this.fetchRepos(username),
      events: this.github.getUserEvents(username)
    }).pipe(
      map(({ profile, repos, events }) => this.composeStats(profile, repos, events)),
      catchError(() => {
        return throwError(() => new Error(`Unable to load data for ${username}`));
      })
    );
  }

  private fetchRepos(username: string) {
    return this.github.getUserRepos(username, 1, 100).pipe(
      switchMap((firstPage) => {
        if (firstPage.length < 100) {
          return of(firstPage);
        }

        return this.github.getUserRepos(username, 2, 100).pipe(
          map((secondPage) => [...firstPage, ...secondPage])
        );
      })
    );
  }

  private composeStats(profile: any, repos: any[], events: any[]): UserCompareStats {
    const totals = repos.reduce(
      (acc, repo) => {
        acc.stars += repo.stargazers_count || 0;
        acc.forks += repo.forks_count || 0;
        acc.watchers += repo.watchers_count || 0;
        if (repo.language) {
          acc.languages[repo.language] = (acc.languages[repo.language] || 0) + 1;
        }
        return acc;
      },
      {
        stars: 0,
        forks: 0,
        watchers: 0,
        repoCount: repos.length,
        languages: {} as Record<string, number>,
        recentCommits: 0
      }
    );

    const recentCommits = (events || [])
      .filter((event: any) => event.type === 'PushEvent')
      .reduce((sum: number, event: any) => sum + (event.payload?.size || event.payload?.commits?.length || 0), 0);
    totals.recentCommits = recentCommits;

    const languageEntries = Object.keys(totals.languages).map((name) => ({
      name,
      value: totals.languages[name]
    }));

    const languageTotal = languageEntries.reduce((sum, entry) => sum + entry.value, 0);

    const topLanguages = languageEntries
      .sort((a, b) => b.value - a.value)
      .slice(0, 4)
      .map((entry, index) => ({
        name: entry.name,
        value: entry.value,
        percentage: languageTotal ? Math.round((entry.value / languageTotal) * 100) : 0,
        color: this.getLanguageColor(index)
      }));

    const topRepos = [...repos]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 3)
      .map((repo) => ({
        name: repo.name,
        stargazers: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        url: repo.html_url,
        language: repo.language || null
      }));

    const impactScore = Math.round(
      profile.followers * 1.5 +
      totals.stars * 0.4 +
      totals.recentCommits * 2 +
      (profile.public_repos || 0)
    );

    return {
      profile,
      totals,
      topLanguages,
      topRepos,
      impactScore
    };
  }
}
