# ✨ IssueBeacon  
## GitHub Issue Explorer & Analytics

**ILLUMINATE YOUR CODEBASE**  
A premium GitHub analytics and issue exploration platform built with **Angular 19** and **Tailwind CSS**.

[![Angular](https://img.shields.io/badge/Angular-19.2-DD0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌐 Live Demo

- **GitHub Pages:**  
  https://bsse23094.github.io/issue-beacon/

- **Vercel:**  
  https://issue-beacon-dpwfn9s0d-ahmed-ayyans-projects.vercel.app

---

## ✨ Features

### 🎨 Premium UI / UX
- Ultra-transparent **glassmorphism**
- Particle network canvas background  
- Smooth fade-in / slide / scale animations  
- Premium typography (Lexend, DM Sans, Instrument Sans)  
- Fully responsive layout  

### 🔍 Issue Explorer
- Browse issues from any public repository  
- Advanced filters: state, sort, direction, labels  
- Real‑time search  
- Secure markdown rendering  
- Pagination with GitHub Link header support  
- Issue detail modal with comments & metadata  

### 📊 Repository Analytics
- Statistics: stars, forks, watchers, issues, size  
- Language distribution donut chart  
- Contributor bar chart  
- Repository metadata  

### 📈 Commit Analytics
- Past‑30‑day commit timeline  
- 24‑hour frequency heatmap  
- Weekly/monthly stats & averages  
- Full commit history list  

### 👥 User Comparison
- Side‑by‑side comparison dashboard  
- Impact score algorithm  
- Language breakdown  
- Top repositories  
- Comparison matrix  

---

## 🧰 Tech Stack

| Category | Tech |
|---------|------|
| Framework | Angular 19 |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS 3.4 |
| State | RxJS 7.8 |
| HTTP | Angular HttpClient |
| Charts | Chart.js 4.5 |
| Markdown | Marked + DOMPurify |
| Storage | IndexedDB (idb) |
| Hosting | GitHub Pages, Vercel, Netlify |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+  
- npm  
- Git  

### Installation

```bash
git clone https://github.com/bsse23094/issue-beacon.git
cd issue-beacon
npm install

cp src/environments/environment.template.ts src/environments/environment.ts
```

### Run

```bash
npm start
```

Then open **http://localhost:4200**.

---

## 🔑 GitHub API Token (Optional)

### Rate Limits
| Mode | Requests / hour |
|------|------------------|
| Without token | 60 |
| With token | 5000 |

### Steps

1. Go to **Settings → Developer Settings → Personal Access Tokens**
2. Click **Generate new token (classic)**
3. No scopes needed  
4. Copy your token

### Add to environment

```ts
export const environment = {
  production: false,
  githubApiBase: 'https://api.github.com',
  githubToken: 'ghp_YOUR_TOKEN_HERE'
};
```

**Do NOT commit tokens.**  
`environment.ts` is already gitignored.

---

## 📖 Usage

### Browse Issues
- Enter repo owner + name  
- Filter by state, sort, labels  
- Search bar updates results instantly  
- Click an issue to view full details  

### Repository Analytics
- Star/fork counts  
- Languages donut chart  
- Contributors bar chart  

### Commit History
- Commit timeline  
- Hourly heatmap  
- Detailed commit list  

### User Comparison
- Two‑user comparison  
- Impact score  
- Most‑used languages  
- Top repos  

---

## 🏗 Architecture

```
src/
├── app/
│   ├── components/
│   │   ├── issue-list/
│   │   ├── issue-detail/
│   │   ├── repo-stats/
│   │   ├── commit-history/
│   │   └── user-compare/
│   ├── services/
│   │   ├── github.service.ts
│   │   ├── db.service.ts
│   │   ├── theme.service.ts
│   │   └── markdown.service.ts
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── environments/
├── styles.css
└── index.html
```

---

## 🎨 Design System

### Glass Variables

```css
--glass-surface: rgba(15, 20, 32, 0.08);
--glass-surface-hover: rgba(15, 20, 32, 0.13);
--glass-blur: blur(20px) saturate(180%);
```

### Gradients

```css
--gradient-primary: linear-gradient(135deg, #667eea, #764ba2);
--gradient-success: linear-gradient(135deg, #f093fb, #f5576c);
```

---

## 📦 Deployment

### GitHub Pages

```bash
npm run build -- --base-href=/issue-beacon/
npx angular-cli-ghpages --dir=dist/github-issue-explorer/browser
```

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Netlify
Upload the build folder:
```
dist/github-issue-explorer/browser/
```

---

## 🧪 Testing

```bash
npm test
npm run e2e
npm run test:coverage
```

---

## 🔮 Roadmap

- [ ] Organization analytics  
- [ ] PR analytics  
- [ ] Regex search  
- [ ] Widgets & customizable dashboard  
- [ ] Multi‑repo comparisons  
- [ ] PWA mode  
- [ ] Export to CSV/JSON  

---

## 🤝 Contributing

1. Fork  
2. Create branch  
3. Commit  
4. Push  
5. Open PR  

Do NOT commit environment.ts or tokens.

---

## 📝 License
MIT License.

---

## 👤 Author
**Ahmed Ayyan**  
GitHub: https://github.com/bsse23094

---

**Built using Angular 19 + Tailwind CSS**
