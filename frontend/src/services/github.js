const GITHUB_API_BASE = 'https://api.github.com';

export const fetchUserRepos = async (username) => {
  if (!username) return [];

  const cacheKey = `github_repos_${username}`;
  try {
    const cached = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Session storage read error:', e);
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=30`);
    if (!response.ok) {
      throw new Error(`Failed to fetch repos: ${response.statusText}`);
    }
    const data = await response.json();
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      }
    } catch (e) {
      console.warn('Session storage write error:', e);
    }
    return data;
  } catch (error) {
    console.error('Error fetching repos:', error);
    throw error;
  }
};