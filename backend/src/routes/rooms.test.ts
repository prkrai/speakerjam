import { describe, expect, it } from 'vitest';

describe('room routes', () => {
  it('accepts room code format', () => {
    const code = 'A7K4P';
    expect(code).toMatch(/^[A-Z0-9]{5,6}$/);
  });
});
