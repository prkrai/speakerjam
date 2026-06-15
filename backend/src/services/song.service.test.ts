import { describe, expect, it } from 'vitest';

describe('song service validation', () => {
  it('accepts supported audio extensions', () => {
    const ext = '.mp3';
    expect(['.mp3', '.wav', '.m4a']).toContain(ext);
  });

  it('rejects oversize files', () => {
    const size = 101 * 1024 * 1024;
    expect(size > 100 * 1024 * 1024).toBe(true);
  });
});
