import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeXquikTweet } from '../lib/xquik.mjs';

test('normalizes the opted-in Xquik response contract', () => {
  assert.deepEqual(
    normalizeXquikTweet({
      id: '123',
      text: 'Normalized tweet',
      created: 1_767_225_600,
      view_count: 1500,
      like_count: 42,
      retweet_count: 5,
      reply_count: 3,
      bookmark_count: 2,
      author: { name: 'Alice', username: 'alice' },
    }),
    {
      id: '123',
      url: 'https://x.com/i/web/status/123',
      author: 'Alice',
      handle: '@alice',
      text: 'Normalized tweet',
      createdAt: '2026-01-01T00:00:00.000Z',
      views: 1500,
      likes: 42,
      reposts: 5,
      replies: 3,
      bookmarks: 2,
      truncated: false,
    },
  );
});

test('keeps compatibility with the default Xquik response contract', () => {
  const result = normalizeXquikTweet({
    id: '456',
    url: 'https://x.com/bob/status/456',
    text: 'Legacy tweet',
    createdAt: '2026-01-02T03:04:05.000Z',
    viewCount: 10,
    likeCount: 4,
    retweetCount: 3,
    replyCount: 2,
    bookmarkCount: 1,
    author: { username: '@bob' },
  });

  assert.equal(result.url, 'https://x.com/bob/status/456');
  assert.equal(result.author, 'bob');
  assert.equal(result.handle, '@bob');
  assert.equal(result.createdAt, '2026-01-02T03:04:05.000Z');
  assert.deepEqual(
    [result.views, result.likes, result.reposts, result.replies, result.bookmarks],
    [10, 4, 3, 2, 1],
  );
});
