export const environment = {
  production: false,
  githubApiBase: 'https://api.github.com',
  // Optional: Add your GitHub Personal Access Token here to increase rate limits
  // Get one at: https://github.com/settings/tokens (no scopes needed for public repos)
  githubToken: '' // Leave empty for public API (60 req/hour) or add token (5000 req/hour)
};
