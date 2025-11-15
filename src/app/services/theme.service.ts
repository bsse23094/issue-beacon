import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeKey = 'ghie:theme';
  // Always dark mode
  private theme$ = new BehaviorSubject<'dark'>('dark');
  themeChanges = this.theme$.asObservable();

  init() {
    this.apply('dark');
  }

  setDarkMode(enable: boolean) {
    // Force dark mode - ignore parameter
    this.apply('dark');
  }

  apply(theme: 'dark') {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }

  get current() {
    return 'dark' as const;
  }

  get isDark() {
    return true;
  }
}
