// GitHub API utility functions

// Extract owner and repo from GitHub URL
export const extractGitHubInfo = (githubUrl) => {
  if (!githubUrl) return null;
  
  const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '') // Remove .git extension if present
  };
};

// Fetch GitHub repository statistics
export const fetchGitHubStats = async (githubUrl) => {
  const repoInfo = extractGitHubInfo(githubUrl);
  if (!repoInfo) {
    throw new Error('Invalid GitHub URL');
  }
  
  const { owner, repo } = repoInfo;
  const baseUrl = 'https://api.github.com';
  
  try {
    // Step 1: Get latest commits (first page)
    console.log(`Fetching commits for ${owner}/${repo}`);
    const commitsResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/commits?per_page=30`);
    if (!commitsResponse.ok) {
      throw new Error(`Failed to fetch commits: ${commitsResponse.status}`);
    }
    const commits = await commitsResponse.json();
    
    let lastCommitDate = null;
    let firstCommitDate = null;
    
    if (commits.length > 0) {
      lastCommitDate = commits[0].commit.committer.date;
      
      if (commits.length < 30) {
        // If less than 30 commits, use the last one as first commit
        firstCommitDate = commits[commits.length - 1].commit.committer.date;
      } else {
        // Check if there's a Link header for pagination
        const linkHeader = commitsResponse.headers.get('Link');
        if (linkHeader && linkHeader.includes('rel="last"')) {
          // Extract the last page URL
          const lastPageMatch = linkHeader.match(/<([^>]+)>;\s*rel="last"/);
          if (lastPageMatch) {
            const lastPageResponse = await fetch(lastPageMatch[1]);
            if (lastPageResponse.ok) {
              const lastPageCommits = await lastPageResponse.json();
              if (lastPageCommits.length > 0) {
                firstCommitDate = lastPageCommits[lastPageCommits.length - 1].commit.committer.date;
              }
            }
          }
        } else {
          // No pagination, use the last commit from current page
          firstCommitDate = commits[commits.length - 1].commit.committer.date;
        }
      }
    }
    
    // Step 2: Get repository metadata
    console.log(`Fetching repository metadata for ${owner}/${repo}`);
    const repoResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}`);
    if (!repoResponse.ok) {
      throw new Error(`Failed to fetch repository: ${repoResponse.status}`);
    }
    const repoData = await repoResponse.json();
    
    // Step 3: Get contributor stats for total commits
    console.log(`Fetching contributors for ${owner}/${repo}`);
    const contributorsResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/contributors?per_page=100`);
    let totalCommits = 0;
    if (contributorsResponse.ok) {
      const contributors = await contributorsResponse.json();
      totalCommits = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);
    }
    
    // Step 4: Get language breakdown
    console.log(`Fetching languages for ${owner}/${repo}`);
    const languagesResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/languages`);
    let languages = {};
    if (languagesResponse.ok) {
      const languageData = await languagesResponse.json();
      const totalBytes = Object.values(languageData).reduce((sum, bytes) => sum + bytes, 0);
      
      // Convert to percentages
      languages = Object.entries(languageData).map(([language, bytes]) => ({
        name: language,
        percentage: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : 0,
        bytes
      })).sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending
    }
    
    return {
      firstCommitDate,
      lastCommitDate,
      totalCommits,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      languages,
      repoUrl: repoData.html_url,
      defaultBranch: repoData.default_branch,
      description: repoData.description,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at
    };
    
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calculate days between dates
export const daysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}; 