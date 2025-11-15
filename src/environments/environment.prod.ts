export const environment = {
  production: true,
  githubApiBase: 'https://api.github.com',
  // For production deployment, leave token empty to avoid exposing it in bundled JS
  // The deployed app will use GitHub's public API (60 requests/hour)
  githubToken: ''
};
