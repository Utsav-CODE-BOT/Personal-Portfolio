const GITHUB_API_BASE = 'https://api.github.com';

export const fetchUserRepos = async (username) => {
  if (!username) return [];

  const cacheKey = `github_repos_${username}`;
  try {
    const cached = typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage.getItem(cacheKey) : null;
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // ignore
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos`);
    if (!response.ok) throw new Error('Failed to fetch repos');
    const data = await response.json();
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(cacheKey, JSON.stringify(data));
      }
    } catch {
      // ignore
    }
    return data;
  } catch (error) {
    console.error('Error fetching repos:', error);
    throw error;
  }
};
