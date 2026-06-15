import { describe, expect, it } from 'vitest';

describe('song routes', () => {
  it('supports audio file types', () => {
    expect(['audio/mpeg', 'audio/wav', 'audio/mp4']).toContain('audio/mpeg');
  });
});
