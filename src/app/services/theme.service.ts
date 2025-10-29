import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeKey = 'ghie:theme';
  private theme$ = new BehaviorSubject<'dark' | 'light'>(this.getInitial());
  themeChanges = this.theme$.asObservable();

  private getInitial(): 'dark' | 'light' {
    try {
      const saved = localStorage.getItem(this.themeKey);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {
      // ignore
    }
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  init() {
    this.apply(this.theme$.value);
  }

  setTheme(theme: 'dark' | 'light') {
    try {
      localStorage.setItem(this.themeKey, theme);
    } catch (e) {
      // ignore
    }
    this.theme$.next(theme);
    this.apply(theme);
  }

  toggle() {
    this.setTheme(this.theme$.value === 'dark' ? 'light' : 'dark');
  }

  apply(theme: 'dark' | 'light') {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }

  get current() {
    return this.theme$.value;
  }

  get isDark() {
    return this.theme$.value === 'dark';
  }
}
