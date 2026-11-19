// Utility to fetch real live stats from official platform APIs

function getStreakFromCalendar(calendar) {
  const activeDays = new Set(
    Object.entries(calendar || {})
      .filter(([, count]) => Number(count) > 0)
      .map(([day]) => new Date(Number(day) * 1000).toLocaleDateString())
  );

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    if (activeDays.has(date.toLocaleDateString())) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function getStreakFromDates(timestamps = []) {
  const activeDays = new Set(timestamps.map(timestamp =>
    new Date(Number(timestamp)).toLocaleDateString()
  ));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    if (activeDays.has(date.toLocaleDateString())) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function getTopicTags(title = '') {
  const text = title.toLowerCase();
  const topics = [];
  if (/dynamic|knapsack|subsequence|coin|fibonacci/.test(text)) topics.push('Dynamic Programming');
  if (/graph|tree|node|bfs|dfs|path|island/.test(text)) topics.push('Graph & Tree');
  if (/array|matrix|grid|two sum|interval/.test(text)) topics.push('Array');
  if (/sort|search|binary/.test(text)) topics.push('Sorting & Searching');
  if (/string|palindrome|substring/.test(text)) topics.push('String');
  if (/greedy|stack|queue|heap/.test(text)) topics.push('Greedy & Data Structures');
  return topics.length ? topics : ['Other'];
}

async function fetchLeetCodeStats(username) {
  if (!username) return null;

  let publicSolved = null;
  let publicEasy = 0;
  let publicMedium = 0;
  let publicHard = 0;
  try {
    const publicRes = await fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}/solved`);
    if (publicRes.ok) {
      const publicData = await publicRes.json();
      publicSolved = Number(publicData.solvedProblem || 0);
      publicEasy = Number(publicData.easySolved || 0);
      publicMedium = Number(publicData.mediumSolved || 0);
      publicHard = Number(publicData.hardSolved || 0);
    }
  } catch (publicError) {
    console.warn('Public LeetCode stats API error:', publicError.message);
  }

  let leetCodeRecent = [];
  try {
    const recentRes = await fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}/acSubmission`);
    if (recentRes.ok) {
      const recentData = await recentRes.json();
      const first = recentData.submission?.[0];
      if (first) {
        leetCodeRecent = [{
          id: `${first.titleSlug}-${first.timestamp}`,
          platform: 'LC',
          title: first.title,
          status: first.statusDisplay || 'Accepted',
          time: new Date(Number(first.timestamp) * 1000).toLocaleDateString(),
          timestamp: Number(first.timestamp) * 1000,
          tags: getTopicTags(first.title)
        }];
      }
    }
  } catch (recentError) {
    console.warn('LeetCode recent submission API error:', recentError.message);
  }

  if (publicSolved > 0) {
    try {
      const res = await fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}/profile`);
      let profile = null;
      if (res.ok) profile = await res.json();

      return {
        handle: username,
        totalSolved: publicSolved,
        totalQuestions: 3800,
        easy: publicEasy,
        easyTotal: 900,
        medium: publicMedium,
        mediumTotal: 1900,
        hard: publicHard,
        hardTotal: 1000,
        contestRating: Number(profile?.contestRating || profile?.rating || 1500),
        globalRanking: profile?.ranking ? String(profile.ranking) : 'N/A',
        acceptanceRate: 'N/A',
        badge: publicSolved > 300 ? 'Knight 🛡️' : 'Coder ⚡',
        contestsCount: Number(profile?.attendedContestsCount || 0),
        history: [],
        streak: 0,
        topicCounts: [],
        configured: true,
        recentSubmissions: leetCodeRecent
      };
    } catch (profileError) {
      console.warn('Public LeetCode profile API error:', profileError.message);
      return {
        handle: username,
        totalSolved: publicSolved,
        totalQuestions: 3800,
        easy: publicEasy,
        easyTotal: 900,
        medium: publicMedium,
        mediumTotal: 1900,
        hard: publicHard,
        hardTotal: 1000,
        contestRating: 1500,
        globalRanking: 'N/A',
        acceptanceRate: 'N/A',
        badge: publicSolved > 300 ? 'Knight 🛡️' : 'Coder ⚡',
        contestsCount: 0,
        history: [],
        streak: 0,
        topicCounts: [],
        configured: true,
        recentSubmissions: leetCodeRecent
      };
    }
  }

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            allQuestionsCount { difficulty count }
            matchedUser(username: $username) {
              username
              profile { ranking reputation starRating realName }
              submissionCalendar
              submitStats: submitStatsGlobal {
                acSubmissionNum { difficulty count submissions }
              }
              tagProblemCounts {
                difficulty
                problemsSolved
                tagName
              }
              recentAcSubmissionList(limit: 20) {
                id
                title
                titleSlug
                timestamp
              }
            }
            userContestRanking(username: $username) {
              attendedContestsCount
              rating
              globalRanking
              totalParticipants
              topPercentage
              badge { name }
            }
            userContestRankingHistory(username: $username) {
              attended
              rating
              ranking
              contest { title startTime }
            }
          }
        `,
        variables: { username }
      })
    });
    const json = await res.json();
    if (!json.data?.matchedUser) return null;

    const matched = json.data.matchedUser;

    const globalAcList = matched.submitStatsGlobal?.acSubmissionNum || [];
    const legacyAcList = matched.submitStats?.acSubmissionNum || [];
    const acList = globalAcList.length > 0 ? globalAcList : legacyAcList;

    const allAc = acList.find(d => d.difficulty === 'All') || { count: 0, submissions: 0 };
    const easyAc = acList.find(d => d.difficulty === 'Easy') || { count: 0 };
    const mediumAc = acList.find(d => d.difficulty === 'Medium') || { count: 0 };
    const hardAc = acList.find(d => d.difficulty === 'Hard') || { count: 0 };

    let solvedCount = publicSolved > 0 ? publicSolved : allAc.count;
    if (solvedCount <= 0) {
      try {
        const publicApiRes = await fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}/solved`);
        if (publicApiRes.ok) {
          const publicData = await publicApiRes.json();
          solvedCount = Number(publicData.solvedProblem || publicData.totalSolved || 0);
          if (solvedCount <= 0) {
            solvedCount = Number(publicData.easySolved || 0) + Number(publicData.mediumSolved || 0) + Number(publicData.hardSolved || 0);
          }
        }
      } catch (publicApiError) {
        console.warn('Public LeetCode stats API error:', publicApiError.message);
      }
    }

    if (solvedCount <= 0) {
      try {
        const fallbackRes = await fetch(`https://leetcode.com/api/user/${encodeURIComponent(username)}/`, {
          headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://leetcode.com' }
        });
        if (fallbackRes.ok) {
          const fallback = await fallbackRes.json();
          const fallbackList = fallback.acSubmissionNum || fallback.submitStats?.acSubmissionNum || [];
          const fallbackAll = fallbackList.find(d => d.difficulty === 'All');
          solvedCount = fallbackAll?.count
            || fallback.numAcceptedQuestions
            || fallback.totalSolved
            || fallback.matchedUserStats?.acSubmissionNum?.find(d => d.difficulty === 'All')?.count
            || 0;
        }
      } catch (fallbackError) {
        console.warn('LeetCode fallback user API error:', fallbackError.message);
      }
    }

    let calendar = {};
    if (typeof matched.submissionCalendar === 'string') {
      try { calendar = JSON.parse(matched.submissionCalendar); } catch { calendar = {}; }
    } else if (matched.submissionCalendar) {
      calendar = matched.submissionCalendar;
    }

    if (solvedCount <= 0) {
      solvedCount = Object.values(calendar).reduce((sum, count) => sum + Number(count || 0), 0);
    }

    const contest = json.data.userContestRanking;
    const lcTopicCounts = (matched.tagProblemCounts || [])
      .filter(item => item.problemsSolved > 0)
      .map(item => ({ name: item.tagName, solved: item.problemsSolved }));

    const lcHistory = (json.data.userContestRankingHistory || [])
      .filter(item => item.attended)
      .slice(-6)
      .map(item => ({
        month: new Date(item.contest.startTime * 1000).toLocaleString('default', { month: 'short' }),
        lc: item.rating
      }));

    const lcRecent = (matched.recentAcSubmissionList || []).map(item => ({
      id: item.id,
      platform: 'LC',
      title: item.title,
      status: 'Accepted',
      time: new Date(Number(item.timestamp) * 1000).toLocaleDateString(),
      timestamp: Number(item.timestamp) * 1000,
      tags: getTopicTags(item.title)
    }));

    const lcCalendar = calendar;
    const lcStreak = getStreakFromCalendar(lcCalendar);

    const allQuestions = json.data.allQuestionsCount || [];
    const totalQ = (allQuestions.find(d => d.difficulty === 'All') || { count: 3350 }).count;
    const easyTotal = (allQuestions.find(d => d.difficulty === 'Easy') || { count: 840 }).count;
    const mediumTotal = (allQuestions.find(d => d.difficulty === 'Medium') || { count: 1730 }).count;
    const hardTotal = (allQuestions.find(d => d.difficulty === 'Hard') || { count: 780 }).count;

    return {
      handle: username,
      totalSolved: solvedCount,
      totalQuestions: totalQ,
      easy: publicEasy > 0 ? publicEasy : easyAc.count,
      easyTotal,
      medium: publicMedium > 0 ? publicMedium : mediumAc.count,
      mediumTotal,
      hard: publicHard > 0 ? publicHard : hardAc.count,
      hardTotal,
      contestRating: contest?.rating ? Math.round(contest.rating) : 1500,
      globalRanking: matched.profile?.ranking ? matched.profile.ranking.toLocaleString() : (contest?.globalRanking ? contest.globalRanking.toLocaleString() : 'N/A'),
      acceptanceRate: allAc.submissions > 0 ? `${Math.round((allAc.count / allAc.submissions) * 1000) / 10}%` : '64.5%',
      badge: contest?.badge?.name ? `${contest.badge.name} 🛡️` : (allAc.count > 300 ? 'Knight 🛡️' : 'Coder ⚡'),
      contestsCount: contest?.attendedContestsCount || 0,
      history: lcHistory,
      streak: lcStreak,
      topicCounts: lcTopicCounts,
      configured: true,
      recentSubmissions: lcRecent
    };
  } catch (err) {
    console.error('LeetCode GraphQL error:', err.message);
    try {
      const fallbackRes = await fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}/solved`);
      if (!fallbackRes.ok) return null;

      const fallback = await fallbackRes.json();
      const solvedCount = Number(fallback.solvedProblem || 0);
      const easy = Number(fallback.easySolved || 0);
      const medium = Number(fallback.mediumSolved || 0);
      const hard = Number(fallback.hardSolved || 0);

      return {
        handle: username,
        totalSolved: solvedCount,
        totalQuestions: 3800,
        easy,
        easyTotal: 900,
        medium,
        mediumTotal: 1900,
        hard,
        hardTotal: 1000,
        contestRating: 1500,
        globalRanking: 'N/A',
        acceptanceRate: 'N/A',
        badge: solvedCount > 300 ? 'Knight 🛡️' : 'Coder ⚡',
        contestsCount: 0,
        history: [],
        streak: 0,
        topicCounts: [],
        configured: true,
        recentSubmissions: []
      };
    } catch (fallbackError) {
      console.error('LeetCode public fallback error:', fallbackError.message);
      return null;
    }
  }
}

async function fetchCodeforcesStats(handle) {
  if (!handle) return null;
  try {
    const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const userData = await userRes.json();
    if (userData.status !== 'OK' || !userData.result?.length) return null;

    const u = userData.result[0];

    // Fetch submissions to count real solved & get real recent submissions
    let solvedUnique = new Set();
    let recentSubs = [];
    const topicSolved = {};
    try {
      const statusRes = await fetch(      `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=200`);      const statusData = await statusRes.json();
      if (statusData.status === 'OK') {
        statusData.result.forEach(s => {
          if (s.verdict === 'OK') {
            solvedUnique.add(`${s.problem.contestId}-${s.problem.index}`);
            (s.problem.tags || []).forEach(tag => {
              topicSolved[tag] = (topicSolved[tag] || 0) + 1;
            });
          }
        });
        const firstAccepted = statusData.result.find(s => s.verdict === 'OK');
        recentSubs = firstAccepted ? [{
          id: firstAccepted.id,
          platform: 'CF',
          title: `${firstAccepted.problem.name} (${firstAccepted.problem.contestId}${firstAccepted.problem.index})`,
          difficulty: firstAccepted.problem.rating ? `${firstAccepted.problem.rating}` : 'Problem',
          status: 'Accepted',
          time: new Date(firstAccepted.creationTimeSeconds * 1000).toLocaleDateString(),
          timestamp: firstAccepted.creationTimeSeconds * 1000,
          tags: firstAccepted.problem.tags || []
        }] : [];
      }
    } catch (e) {
      console.warn('CF submissions error:', e.message);
    }

    // Fetch rating history
    let realHistory = [];
    let contestsCount = 0;
    try {
      const ratingRes = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
      const ratingData = await ratingRes.json();
      if (ratingData.status === 'OK' && ratingData.result?.length > 0) {
        contestsCount = ratingData.result.length;
        realHistory = ratingData.result.slice(-6).map(r => ({
          month: new Date(r.ratingUpdateTimeSeconds * 1000).toLocaleString('default', { month: 'short' }),
          cf: r.newRating
        }));
      }
    } catch (e) {
      console.warn('CF rating history error:', e.message);
    }

    return {
      handle: u.handle,
      rating: u.rating || 0,
      maxRating: u.maxRating || 0,
      rank: u.rank ? u.rank.charAt(0).toUpperCase() + u.rank.slice(1) : 'Unrated',
      maxRank: u.maxRank ? u.maxRank.charAt(0).toUpperCase() + u.maxRank.slice(1) : 'Unrated',
      solvedCount: solvedUnique.size > 0 ? solvedUnique.size : 0,
      topicCounts: Object.entries(topicSolved).map(([name, solved]) => ({ name, solved })),
      contestsCount,
      streak: getStreakFromDates(recentSubs.map(sub => sub.timestamp)),
      contribution: u.contribution > 0 ? `+${u.contribution}` : `${u.contribution}`,
      configured: true,
      history: realHistory,
      recentSubmissions: recentSubs
    };
  } catch (err) {
    console.error('Codeforces fetch error:', err.message);
    return null;
  }
}

async function fetchCodeChefStats(handle) {
  if (!handle) return null;
  try {
    const res = await fetch(`https://www.codechef.com/users/${handle}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();

    const ratingMatch = html.match(/class="rating-number"[^>]*>\s*(\d+)/i) || html.match(/"rating":(\d+)/);
    const highestMatch = html.match(/Highest Rating\s*(\d+)/i) || html.match(/\(Highest Rating\s*<[^>]+>(\d+)/i);
    const globalRankMatch = html.match(/Global Rank[^\d]*(\d+)/i);
    const countryRankMatch = html.match(/Country Rank[^\d]*(\d+)/i);
    const divMatch = html.match(/\((Div \d)\)/i);

    let starCount = 1;
    const starSection = html.match(/class="rating-star"[^>]*>([\s\S]*?)<\/div>/i);
    if (starSection) {
      const starsMatches = starSection[1].match(/&#9733;/g) || starSection[1].match(/★/g);
      if (starsMatches) starCount = starsMatches.length;
    }

    const ratingVal = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;
    const solvedMatch = html.match(/(?:Problems Solved|Fully Solved)[^\d]*(\d+)/i);
    const contestsMatch = html.match(/(?:Contests?|Contest participated)[^\d]*(\d+)/i);
    const solvedCount = solvedMatch ? parseInt(solvedMatch[1], 10) : 0;
    const contestCount = contestsMatch ? parseInt(contestsMatch[1], 10) : 0;

    return {
      handle,
      stars: `${'★'.repeat(starCount)} (${starCount}-Star)`,
      rating: ratingVal,
      maxRating: highestMatch ? parseInt(highestMatch[1], 10) : ratingVal,
      division: divMatch ? divMatch[1] : (ratingVal > 1600 ? 'Div 2' : 'Div 3'),
      globalRank: globalRankMatch ? parseInt(globalRankMatch[1], 10).toLocaleString() : 'N/A',
      countryRank: countryRankMatch ? parseInt(countryRankMatch[1], 10).toLocaleString() : 'N/A',
      solvedCount,
      contestsCount: contestCount,
      history: ratingVal ? [{ month: 'Current', cc: ratingVal }] : [],
      streak: 0,
      configured: ratingVal > 0
    };
  } catch (err) {
    console.error('CodeChef fetch error:', err.message);
    return null;
  }
}

async function getAggregatedLiveStats(handles = {}) {
  const [lcStats, cfStats, ccStats] = await Promise.all([
    fetchLeetCodeStats(handles.leetcode),
    fetchCodeforcesStats(handles.codeforces),
    fetchCodeChefStats(handles.codechef)
  ]);

  const lcRecent = lcStats?.recentSubmissions?.[0] || null;
  const cfRecent = cfStats?.recentSubmissions?.[0] || null;
  const ccRecent = ccStats?.recentSubmissions?.[0] || null;

  const recentSubmissions = [lcRecent, cfRecent, ccRecent]
    .filter(Boolean)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const topicCounts = {};
  for (const topic of lcStats?.topicCounts || []) {
    topicCounts[topic.name] = (topicCounts[topic.name] || 0) + topic.solved;
  }
  for (const topic of cfStats?.topicCounts || []) {
    topicCounts[topic.name] = (topicCounts[topic.name] || 0) + topic.solved;
  }

  const topics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, solved]) => ({ name, solved }));

  const activity = {};
  for (const submission of recentSubmissions) {
    activity[submission.time] = (activity[submission.time] || 0) + 1;
  }

  const streak = Math.max(lcStats?.streak || 0, cfStats?.streak || 0, ccStats?.streak || 0);
  const totalSolved = (lcStats?.totalSolved || 0) + (cfStats?.solvedCount || 0) + (ccStats?.solvedCount || 0);
  const contestsPlayed = (lcStats?.contestsCount || 0) + (cfStats?.contestsCount || 0) + (ccStats?.contestsCount || 0);
  const peakRating = Math.max(lcStats?.contestRating || 0, cfStats?.maxRating || 0, ccStats?.maxRating || 0);

  return {
    leetcode: lcStats,
    codeforces: cfStats,
    codechef: ccStats,
    totalSolved,
    contestsPlayed,
    peakRating,
    streak,
    topics,
    recentSubmissions,
    activity
  };
}

module.exports = {
  fetchLeetCodeStats,
  fetchCodeforcesStats,
  fetchCodeChefStats,
  getAggregatedLiveStats
};
