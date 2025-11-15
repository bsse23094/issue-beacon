// Development environment configuration
// For local development with a personal token, copy this to environment.local.ts and add your token
export const environment = {
  production: false,
  githubApiBase: 'https://api.github.com',
  // Optional: Add your GitHub Personal Access Token here to increase rate limits
  // Without token: 60 requests/hour
  // With token: 5,000 requests/hour
  // Get one at: https://github.com/settings/tokens
  // No scopes needed for public repositories!
  githubToken: '' // Leave empty for public API, or add token for higher limits
};
