function metric(tweet, normalizedKey, legacyKey) {
  return Number(tweet?.[normalizedKey] ?? tweet?.[legacyKey]) || 0;
}

function normalizedCreatedAt(tweet) {
  const value = tweet?.created ?? tweet?.created_at ?? tweet?.createdAt;
  if (typeof value !== 'number') return typeof value === 'string' ? value : '';

  const milliseconds = value >= 100_000_000_000 ? value : value * 1000;
  const createdAt = new Date(milliseconds);
  return Number.isNaN(createdAt.getTime()) ? '' : createdAt.toISOString();
}

export function normalizeXquikTweet(tweet) {
  const id = String(tweet?.id || '');
  const username = String(tweet?.author?.username || '').replace(/^@/, '');
  return {
    id,
    url: tweet?.url || (id ? `https://x.com/i/web/status/${id}` : ''),
    author: tweet?.author?.name || username || 'X',
    handle: username ? `@${username}` : '',
    text: tweet?.text || '',
    createdAt: normalizedCreatedAt(tweet),
    views: metric(tweet, 'view_count', 'viewCount'),
    likes: metric(tweet, 'like_count', 'likeCount'),
    reposts: metric(tweet, 'retweet_count', 'retweetCount'),
    replies: metric(tweet, 'reply_count', 'replyCount'),
    bookmarks: metric(tweet, 'bookmark_count', 'bookmarkCount'),
    truncated: false,
  };
}
