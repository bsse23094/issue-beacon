// Copy this file to environment.ts and add your GitHub token
export const environment = {
  production: false,
  githubApiBase: 'https://api.github.com',
  // Optional: Add your GitHub Personal Access Token here to increase rate limits
  // Without token: 60 requests/hour
  // With token: 5,000 requests/hour
  // Get one at: https://github.com/settings/tokens
  // No scopes needed for public repositories!
  githubToken: '' // Add your token here: 'ghp_xxxxxxxxxxxxxxxxxxxx'
};
