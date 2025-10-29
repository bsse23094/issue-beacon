# GitHub Issue Explorer - Project Structure

## 📁 File Organization

```
github-issue-explorer/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── issue-list/
│   │   │   │   ├── issue-list.component.ts
│   │   │   │   ├── issue-list.component.html
│   │   │   │   └── issue-list.component.css
│   │   │   └── issue-detail/
│   │   │       ├── issue-detail.component.ts
│   │   │       ├── issue-detail.component.html
│   │   │       └── issue-detail.component.css
│   │   ├── services/
│   │   │   ├── github.service.ts          # GitHub API integration
│   │   │   ├── github.service.spec.ts
│   │   │   ├── db.service.ts              # IndexedDB caching
│   │   │   └── markdown.service.ts        # Markdown rendering
│   │   ├── models/
│   │   │   └── index.ts                   # TypeScript interfaces
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.routes.ts                  # Route definitions
│   │   └── app.config.ts                  # App configuration
│   ├── environments/
│   │   ├── environment.ts                 # Dev config
│   │   └── environment.prod.ts            # Prod config
│   ├── styles.css                         # Global styles + Tailwind
│   └── index.html
├── tailwind.config.js                     # Tailwind configuration
├── postcss.config.js                      # PostCSS configuration
├── angular.json                           # Angular CLI config
├── tsconfig.json                          # TypeScript config
├── package.json                           # Dependencies
└── README.md                              # Documentation
```

## 🔑 Key Files

### Services

**`github.service.ts`** - GitHub API Integration
- `getIssues()` - Fetch issues with filters and pagination
- `getIssue()` - Fetch single issue
- `getIssueComments()` - Fetch comments for an issue
- `renderMarkdown()` - Optional GitHub markdown API (not used, client-side instead)
- Parses Link headers for pagination
- Automatic caching via DbService

**`db.service.ts`** - IndexedDB Cache
- `cacheIssue()` - Cache single issue
- `cacheIssues()` - Cache multiple issues
- `getCachedIssues()` - Retrieve cached issues (5-min TTL)
- `clearCache()` - Clear all cached data

**`markdown.service.ts`** - Markdown Rendering
- `render()` - Convert markdown to sanitized HTML
- `renderInline()` - Render inline markdown
- Uses `marked` for parsing + `DOMPurify` for XSS protection

### Components

**`issue-list.component.ts`** - Issue Browser
- Filters: state, labels, sort, direction
- Pagination with prev/next
- Repository input (owner/repo)
- Loading and error states

**`issue-detail.component.ts`** - Issue Detail View
- Displays full issue with rendered markdown
- Shows all comments with rendered markdown
- User avatars and metadata
- Back navigation

### Models

**`models/index.ts`** - TypeScript Interfaces
```typescript
interface Issue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  labels: Label[];
  user: User;
  comments: number;
  created_at: string;
  updated_at: string;
}

interface IssueComment {
  id: number;
  user: User;
  body: string;
  created_at: string;
  updated_at: string;
}
```

## 🎨 Styling

- **Tailwind CSS 3** for utility classes
- **Prose plugin** for markdown rendering styles
- Responsive design with mobile-first approach
- Custom label colors with contrast calculation

## 🚀 Running the App

```powershell
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🔧 Customization

### Change Default Repository

Edit `issue-list.component.ts`:
```typescript
owner = 'facebook';  // Change this
repo = 'react';      // Change this
```

### Adjust Cache Duration

Edit `db.service.ts`:
```typescript
private readonly CACHE_DURATION = 5 * 60 * 1000; // Change to desired ms
```

### Add Authentication

Edit `github.service.ts`:
```typescript
constructor(private http: HttpClient, private db: DbService) {}

// Add headers to requests
private readonly headers = new HttpHeaders({
  'Authorization': 'token YOUR_GITHUB_TOKEN'
});

// Update HTTP calls to include headers
this.http.get<Issue[]>(url, { params, headers: this.headers, observe: 'response' })
```

## 📦 Dependencies

### Core
- `@angular/core` - Angular framework
- `@angular/common` - Common Angular utilities
- `@angular/router` - Routing
- `rxjs` - Reactive programming

### UI
- `tailwindcss` - CSS framework
- `autoprefixer` - PostCSS plugin
- `postcss` - CSS processing

### Utilities
- `marked` - Markdown parser
- `dompurify` - HTML sanitizer
- `idb` - IndexedDB wrapper
- `axios` - HTTP client (not used, can remove)

## 🐛 Known Issues

1. **CSS Linter Warnings** - `@tailwind` directives show as "unknown at rule" in editors. This is normal and doesn't affect builds.

2. **Rate Limiting** - GitHub API has a 60 req/hour limit for unauthenticated requests. Add a token to increase to 5,000 req/hour.

3. **SSR Compatibility** - IndexedDB only works client-side. The app handles this gracefully.

## 💡 Tips

- Press `Ctrl+Shift+I` to open DevTools and inspect network requests
- Check IndexedDB in Application tab to see cached data
- Use Redux DevTools for state debugging (if implemented)
- Test offline by disabling network in DevTools

---

Need help? Check the README.md or open an issue!
