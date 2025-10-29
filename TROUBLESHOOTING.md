# Troubleshooting Guide

## Common Issues and Solutions

### 1. Tailwind CSS Not Working

**Symptoms:** No styles, classes not applying

**Solutions:**
```powershell
# Clear Angular cache
Remove-Item -Recurse -Force .angular

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install

# Verify tailwind.config.js exists
# Verify postcss.config.js exists
# Verify src/styles.css has @tailwind directives

# Restart dev server
npm start
```

### 2. GitHub API Rate Limit Exceeded

**Symptoms:** Error 403, "API rate limit exceeded"

**Solution:** Add GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Generate new token (classic) with `public_repo` scope
3. Add to `src/app/services/github.service.ts`:

```typescript
import { HttpHeaders } from '@angular/common/http';

export class GithubService {
  private readonly headers = new HttpHeaders({
    'Authorization': 'token YOUR_TOKEN_HERE'
  });

  getIssues(...) {
    return this.http.get<Issue[]>(url, { 
      params, 
      headers: this.headers,  // Add this
      observe: 'response' 
    });
  }
}
```

### 3. IndexedDB Errors

**Symptoms:** "Failed to open database", caching not working

**Solutions:**
```powershell
# Clear browser data
# In DevTools > Application > IndexedDB > Delete database

# Check if running in private/incognito mode (IndexedDB disabled)
# Use regular browser window

# Verify idb package is installed
npm list idb
```

### 4. Markdown Not Rendering

**Symptoms:** Raw markdown text visible, no formatting

**Solutions:**
```powershell
# Verify packages installed
npm list marked dompurify

# Check browser console for errors
# Verify MarkdownService is injected
# Check if body content exists (some issues have null body)
```

### 5. Routing Not Working

**Symptoms:** Blank page, routes not loading

**Solutions:**
```typescript
// Verify app.config.ts has provideRouter
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),  // Must be here
    // ...
  ]
};

// Verify app.component.html has router-outlet
<router-outlet></router-outlet>

// Check route definitions in app.routes.ts
```

### 6. Build Errors

**Common Errors:**

**"Cannot find module"**
```powershell
# Install missing package
npm install <package-name>

# Or reinstall all
npm install
```

**"Property does not exist on type"**
```typescript
// Add property to component class
// Or check for typos in template
```

**"Module not found: Error: Can't resolve"**
```powershell
# Clear cache and rebuild
Remove-Item -Recurse -Force .angular
npm start
```

### 7. CORS Errors

**Symptoms:** "Access-Control-Allow-Origin" errors

**Note:** GitHub API has proper CORS headers. If you see this:
- Check if API endpoint is correct
- Verify you're not using a proxy that blocks CORS
- Try different network (some corporate networks block)

### 8. SSR Errors

**Symptoms:** "window is not defined", "document is not defined"

**Solutions:**
```typescript
// Wrap browser-only code in platform check
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export class MyComponent {
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Browser-only code here
      window.localStorage.setItem(...);
    }
  }
}
```

### 9. Slow Loading

**Solutions:**
- Enable caching (already implemented with IndexedDB)
- Reduce `per_page` parameter (currently 30)
- Add loading skeletons
- Implement virtual scrolling for large lists

### 10. Missing Images/Icons

**Symptoms:** Broken avatar images, missing icons

**Solutions:**
- Check GitHub API response has `avatar_url`
- Verify image URLs are not blocked by firewall
- Add fallback images:

```typescript
<img 
  [src]="issue.user.avatar_url" 
  [alt]="issue.user.login"
  (error)="$event.target.src='assets/default-avatar.png'"
>
```

## Development Issues

### Hot Reload Not Working

```powershell
# Restart dev server
# Check file watcher limits (Linux/Mac)

# Windows: Verify files aren't locked
# Kill all node processes
taskkill /F /IM node.exe

# Restart
npm start
```

### TypeScript Errors

```powershell
# Check TypeScript version matches Angular
npm list typescript

# Verify tsconfig.json is correct
# Check for strict mode issues
```

### Performance Issues

```typescript
// Use trackBy for ngFor loops
<div *ngFor="let issue of issues; trackBy: trackByIssueId">

trackByIssueId(index: number, issue: Issue): number {
  return issue.id;
}

// Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

## Testing Issues

### Tests Failing

```powershell
# Clear test cache
npm test -- --no-cache

# Update snapshots
npm test -- -u

# Run single test file
npm test -- issue-list.component.spec.ts
```

### HTTP Mocking Not Working

```typescript
// Use provideHttpClientTesting
import { provideHttpClientTesting } from '@angular/common/http/testing';

TestBed.configureTestingModule({
  providers: [
    provideHttpClient(),
    provideHttpClientTesting()
  ]
});
```

## Browser Compatibility

- **Chrome/Edge:** ✅ Full support
- **Firefox:** ✅ Full support
- **Safari:** ✅ Full support (IndexedDB since iOS 8)
- **IE11:** ❌ Not supported (use Angular 12 or polyfills)

## Getting Help

1. Check browser console for errors
2. Check network tab for API responses
3. Verify environment variables
4. Review recent code changes
5. Search GitHub issues
6. Ask in Angular Discord/Stack Overflow

## Useful Commands

```powershell
# View detailed error stack
npm start --verbose

# Check for outdated packages
npm outdated

# Update Angular CLI
npm install -g @angular/cli@latest

# Analyze bundle size
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/stats.json

# Clear everything and start fresh
Remove-Item -Recurse -Force node_modules, .angular, dist
npm install
npm start
```

---

Still stuck? Open an issue with:
- Error message
- Browser/OS version
- Steps to reproduce
- Screenshots if applicable
