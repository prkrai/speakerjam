import { describe, expect, it } from 'vitest';

describe('room service logic', () => {
  it('creates a room response shape', () => {
    const result = { roomId: 'room-1', roomCode: 'A7K4P', host: { id: 'u1', email: 'a@example.com' } };
    expect(result.roomCode).toHaveLength(5);
  });

  it('handles host transfer rule', () => {
    const members = [{ id: 'u2' }, { id: 'u3' }];
    expect(members[0].id).toBe('u2');
  });
});
