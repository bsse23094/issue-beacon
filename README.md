# 🔍 IssueBeacon# GitHub Issue Explorer



**ILLUMINATE YOUR CODEBASE** - A sleek, modern GitHub Issue Explorer built with Angular 19A modern Angular application to browse and explore GitHub issues with offline support, markdown rendering, and a beautiful Tailwind UI.



[![Angular](https://img.shields.io/badge/Angular-19.2-DD0031?logo=angular)](https://angular.io/)## ✨ Features

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)- 🔍 **Browse GitHub Issues** - Search and filter issues from any public repository

- 🏷️ **Advanced Filtering** - Filter by state (open/closed/all), labels, sort order, and more

## ✨ Features- 📖 **Markdown Rendering** - Secure client-side markdown rendering with syntax highlighting

- 💾 **Offline Support** - IndexedDB caching for offline browsing (5-minute cache)

### 🎨 Beautiful UI/UX- 📱 **Responsive Design** - Beautiful Tailwind CSS UI that works on all devices

- **Dual Theme Support** - Stunning light and dark modes with smooth transitions- 🔗 **Pagination** - Navigate through large issue lists with Link header support

- **Glassmorphism Design** - Modern cards with backdrop blur effects- 💬 **Comments** - View all comments with rendered markdown

- **Particle Network Background** - Interactive animated canvas- ⚡ **Fast** - Built with Angular 19 with SSR support

- **Smooth Animations** - Slide-up, fade-in, and scale effects

## 🚀 Quick Start

### 🔍 Powerful Search & Filtering

- **Real-time Search** - Search through issue titles and descriptions### Prerequisites

- **State Filters** - Filter by All, Open, or Closed issues

- **Smart Pagination** - 10 issues per page with navigation- Node.js 18+ and npm

- **Live Results** - See results update as you type- Git



### 📊 Interactive Dashboard### Installation

- **Statistics Cards** - Total, Open, Closed issues, and Average Comments

- **Repository Switcher** - Explore popular repositories```powershell

- **Issue Detail Modal** - Click any issue to see full details# Install dependencies

- **Direct GitHub Links** - Open issues directly on GitHubnpm install



## 🚀 Quick Start# Start the development server

npm start

```bash```

git clone https://github.com/bsse23094/issue-beacon.git

cd issue-beaconThe app will be available at **http://localhost:4200/**

npm install

npm start### Build for Production

```

```powershell

Visit `http://localhost:4200` 🎉npm run build

```

## 📦 Deployment

## 📖 Usage

### Vercel (Recommended - One Click)

### Browse Issues

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bsse23094/issue-beacon)

1. Enter a repository owner (e.g., `facebook`) and repository name (e.g., `react`)

Or manually:2. Use the filters to refine your search:

```bash   - **State**: Open, Closed, or All issues

npm install -g vercel   - **Sort By**: Created, Updated, or Comments

vercel   - **Direction**: Newest or Oldest first

```   - **Labels**: Comma-separated label names (e.g., `bug,enhancement`)



### Netlify### View Issue Details



1. Build: `npm run build`- Click any issue to view full details

2. Deploy `dist/github-issue-explorer/browser` folder- See rendered markdown body and all comments

- View labels, state, and metadata

## 🎯 Tech Stack

## 🏗️ Architecture

- **Angular 19** - Latest standalone components

- **Tailwind CSS** - Utility-first styling### Core Services

- **TypeScript** - Type-safe code

- **GitHub API** - Real-time data- **GithubService** (`src/app/services/github.service.ts`)

- **RxJS** - Reactive programming  - Fetches issues and comments from GitHub API

  - Handles pagination via Link headers

## 📖 Usage  - Automatic caching fallback on network errors



1. Select a repository from the sidebar- **DbService** (`src/app/services/db.service.ts`)

2. Search and filter issues  - IndexedDB wrapper using `idb` library

3. Click any issue for details  - 5-minute cache duration

4. Toggle light/dark mode anytime!  - Offline-first data access



## 👤 Author- **MarkdownService** (`src/app/services/markdown.service.ts`)

  - Secure markdown rendering with `marked` + `DOMPurify`

**bsse23094** - [GitHub](https://github.com/bsse23094)  - GitHub Flavored Markdown support

  - XSS protection

## 📄 License

### Components

MIT License

- **IssueListComponent** - Browse and filter issues with pagination

---- **IssueDetailComponent** - View issue details with comments



**⭐ Star this repo if you find it helpful!**### Tech Stack


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
