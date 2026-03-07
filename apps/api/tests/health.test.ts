import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';

describe('API Health', () => {
  it('should create the Koa app', () => {
    const app = createApp();
    expect(app).toBeDefined();
    expect(app.listen).toBeDefined();
  });

  it('should have routes registered', () => {
    const app = createApp();
    expect(app.middleware.length).toBeGreaterThan(0);
  });
});
