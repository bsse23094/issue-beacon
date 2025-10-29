# GitHub Issue Explorer

A modern Angular application to browse and explore GitHub issues with offline support, markdown rendering, and a beautiful Tailwind UI.

## ✨ Features

- 🔍 **Browse GitHub Issues** - Search and filter issues from any public repository
- 🏷️ **Advanced Filtering** - Filter by state (open/closed/all), labels, sort order, and more
- 📖 **Markdown Rendering** - Secure client-side markdown rendering with syntax highlighting
- 💾 **Offline Support** - IndexedDB caching for offline browsing (5-minute cache)
- 📱 **Responsive Design** - Beautiful Tailwind CSS UI that works on all devices
- 🔗 **Pagination** - Navigate through large issue lists with Link header support
- 💬 **Comments** - View all comments with rendered markdown
- ⚡ **Fast** - Built with Angular 19 with SSR support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```powershell
# Install dependencies
npm install

# Start the development server
npm start
```

The app will be available at **http://localhost:4200/**

### Build for Production

```powershell
npm run build
```

## 📖 Usage

### Browse Issues

1. Enter a repository owner (e.g., `facebook`) and repository name (e.g., `react`)
2. Use the filters to refine your search:
   - **State**: Open, Closed, or All issues
   - **Sort By**: Created, Updated, or Comments
   - **Direction**: Newest or Oldest first
   - **Labels**: Comma-separated label names (e.g., `bug,enhancement`)

### View Issue Details

- Click any issue to view full details
- See rendered markdown body and all comments
- View labels, state, and metadata

## 🏗️ Architecture

### Core Services

- **GithubService** (`src/app/services/github.service.ts`)
  - Fetches issues and comments from GitHub API
  - Handles pagination via Link headers
  - Automatic caching fallback on network errors

- **DbService** (`src/app/services/db.service.ts`)
  - IndexedDB wrapper using `idb` library
  - 5-minute cache duration
  - Offline-first data access

- **MarkdownService** (`src/app/services/markdown.service.ts`)
  - Secure markdown rendering with `marked` + `DOMPurify`
  - GitHub Flavored Markdown support
  - XSS protection

### Components

- **IssueListComponent** - Browse and filter issues with pagination
- **IssueDetailComponent** - View issue details with comments

### Tech Stack

- **Angular 19** - Latest Angular with standalone components and SSR
- **Tailwind CSS 3** - Utility-first CSS framework
- **marked** - Markdown parser
- **DOMPurify** - HTML sanitizer
- **idb** - IndexedDB wrapper
- **RxJS** - Reactive programming

## 🔧 Configuration

### GitHub API Rate Limits

The app uses unauthenticated GitHub API requests with a rate limit of:
- **60 requests per hour** per IP address

To increase the rate limit to **5,000 requests per hour**:

1. Create a GitHub Personal Access Token (PAT) at https://github.com/settings/tokens
2. Add it to the `GithubService`:

```typescript
// In src/app/services/github.service.ts
private readonly headers = new HttpHeaders({
  'Authorization': 'token YOUR_GITHUB_TOKEN'
});
```

### Environment Configuration

Edit `src/environments/environment.ts` to change the API base URL or add other settings.

## 📝 TODO / Future Enhancements

- [ ] **OAuth Login** - Implement OAuth for higher rate limits and private repos
- [ ] **TanStack Query** - Replace RxJS caching with `@tanstack/angular-query`
- [ ] **Syntax Highlighting** - Add code syntax highlighting with Prism.js
- [ ] **Dark Mode** - Add dark theme support
- [ ] **Search** - Add full-text search across issues
- [ ] **Filters UI** - Add visual filter chips and advanced filter builder
- [ ] **Keyboard Shortcuts** - Add shortcuts for navigation and actions
- [ ] **Accessibility** - Improve ARIA labels and keyboard navigation
- [ ] **Error Boundaries** - Better error handling and recovery
- [ ] **Performance** - Add virtual scrolling for large lists
- [ ] **PWA** - Convert to Progressive Web App with service workers

## 🧪 Testing

```powershell
# Run unit tests
npm test

# Run e2e tests (if configured)
npm run e2e
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

---

Built with ❤️ using Angular and Tailwind CSS

---

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
