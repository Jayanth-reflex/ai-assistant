// SessionManager.test.ts
import { SessionManager } from '../electron/services/SessionManager';

describe('SessionManager', () => {
  it('should create a new session folder', () => {
    const sessionPath = SessionManager.createSession();
    expect(typeof sessionPath).toBe('string');
    // TODO: Check if folder exists
  });
}); 