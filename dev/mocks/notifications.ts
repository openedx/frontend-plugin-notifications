import type MockAdapter from 'axios-mock-adapter';

interface NotificationSeed {
  notification_type: string,
  content: string,
  unseen?: boolean,
}

interface StoredNotification {
  id: number,
  app_name: string,
  notification_type: string,
  content: string,
  content_url: string,
  content_context: { course_name: string },
  created: string,
  last_read: string | null,
  last_seen: string | null,
}

const seedsByApp: Record<string, NotificationSeed[]> = {
  discussion: [
    { notification_type: 'new_comment', content: '<strong>alice</strong> replied to your post in <em>Week 2 Discussion</em>', unseen: true },
    { notification_type: 'new_response', content: '<strong>bob</strong> responded to your question about assignment 3', unseen: true },
    { notification_type: 'new_comment_on_response', content: '<strong>carol</strong> liked your answer in <em>Course Intro</em>', unseen: true },
    { notification_type: 'new_discussion_post', content: 'A new post was added to <em>General Discussion</em>', unseen: true },
    { notification_type: 'new_comment', content: '<strong>dave</strong> mentioned you in <em>Week 3 Discussion</em>' },
    { notification_type: 'new_response', content: '<strong>eve</strong> answered your follow-up question' },
    { notification_type: 'new_discussion_post', content: '<strong>frank</strong> started a new thread in <em>General Discussion</em>' },
    { notification_type: 'new_comment_on_response', content: '<strong>grace</strong> replied to your comment' },
    { notification_type: 'new_comment', content: '<strong>heidi</strong> commented on a post you follow' },
    { notification_type: 'new_response', content: '<strong>ivan</strong> marked your answer as helpful' },
    { notification_type: 'new_discussion_post', content: 'A new announcement post appeared in <em>Course Staff</em>' },
    { notification_type: 'new_comment', content: '<strong>judy</strong> quoted you in <em>Week 2 Discussion</em>' },
    { notification_type: 'new_response', content: '<strong>mallory</strong> asked a follow-up to your post' },
  ],
  updates: [
    { notification_type: 'course_update', content: 'Instructor posted a course-wide update: "Midterm rescheduled"', unseen: true },
    { notification_type: 'course_update', content: 'Office hours moved to Thursdays at 3pm', unseen: true },
  ],
  grading: [
    { notification_type: 'grade_posted', content: 'Your grade is available for <em>Assignment 3</em>', unseen: true },
  ],
};

const PAGE_SIZE = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

function buildInitialState(): StoredNotification[] {
  const store: StoredNotification[] = [];
  const now = Date.now();
  const olderStart = now - 3 * DAY_MS;
  let nextId = 1;
  let olderOffset = 0;
  Object.entries(seedsByApp).forEach(([appName, seeds]) => {
    seeds.forEach((seed) => {
      const isUnseen = seed.unseen === true;
      const created = isUnseen
        ? new Date(now - (nextId * 37 * 60 * 1000)).toISOString()
        : new Date(olderStart - (olderOffset++ * 90 * 60 * 1000)).toISOString();
      store.push({
        id: nextId++,
        app_name: appName,
        notification_type: seed.notification_type,
        content: seed.content,
        content_url: '#',
        content_context: { course_name: 'Intro to Open edX' },
        created,
        last_read: isUnseen ? null : new Date(olderStart).toISOString(),
        last_seen: isUnseen ? null : new Date(olderStart).toISOString(),
      });
    });
  });
  return store;
}

export function registerNotificationsMocks(mock: MockAdapter, lmsBaseUrl: string): void {
  const state = buildInitialState();

  const countUnseen = () => state.reduce<Record<string, number>>((acc, n) => {
    if (n.last_seen === null) {
      acc[n.app_name] = (acc[n.app_name] ?? 0) + 1;
    }
    return acc;
  }, {});

  mock.onGet(`${lmsBaseUrl}/api/notifications/count/`).reply(() => {
    const countByApp = countUnseen();
    const total = Object.values(countByApp).reduce((a, b) => a + b, 0);
    return [200, {
      show_notifications_tray: true,
      count: total,
      count_by_app_name: {
        discussion: countByApp.discussion ?? 0,
        updates: countByApp.updates ?? 0,
        grading: countByApp.grading ?? 0,
      },
      notification_expiry_days: 60,
      is_new_notification_view_enabled: false,
    }];
  });

  mock.onGet(new RegExp(`^${lmsBaseUrl}/api/notifications/(\\?.*)?$`)).reply((config) => {
    const appName = String(config.params?.app_name ?? 'discussion');
    const page = Number(config.params?.page ?? 1);
    const items = state
      .filter((n) => n.app_name === appName)
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    const numPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const results = items.slice(start, start + PAGE_SIZE);
    const hasNext = page < numPages;
    return [200, {
      next: hasNext ? `${lmsBaseUrl}/api/notifications/?app_name=${appName}&page=${page + 1}` : null,
      previous: page > 1 ? `${lmsBaseUrl}/api/notifications/?app_name=${appName}&page=${page - 1}` : null,
      count: items.length,
      num_pages: numPages,
      current_page: page,
      start,
      results,
    }];
  });

  mock.onPut(new RegExp(`^${lmsBaseUrl}/api/notifications/mark-seen/([^/]+)/?$`)).reply((config) => {
    const match = config.url?.match(/\/mark-seen\/([^/?]+)\/?/);
    const appName = match?.[1];
    if (appName) {
      const now = new Date().toISOString();
      state.forEach((n) => {
        if (n.app_name === appName && n.last_seen === null) {
          n.last_seen = now;
        }
      });
    }
    return [200, { message: 'ok' }];
  });

  mock.onPatch(`${lmsBaseUrl}/api/notifications/read/`).reply((config) => {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {});
    const now = new Date().toISOString();
    if (typeof body.notification_id === 'number') {
      const hit = state.find((n) => n.id === body.notification_id);
      if (hit) {
        hit.last_read = now;
      }
    } else if (typeof body.app_name === 'string') {
      state.forEach((n) => {
        if (n.app_name === body.app_name) {
          n.last_read = now;
        }
      });
    }
    return [200, { message: 'ok' }];
  });
}
