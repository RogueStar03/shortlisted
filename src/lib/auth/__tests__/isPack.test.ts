import { isPack } from '../isPack';

describe('isPack', () => {
  const future = new Date(Date.now() + 86400000).toISOString();
  const past = new Date(Date.now() - 86400000).toISOString();

  it('true when plan=pack and expires in future', () => {
    expect(isPack({ plan: 'pack', plan_expires_at: future })).toBe(true);
  });

  it('false when plan=pack but expired', () => {
    expect(isPack({ plan: 'pack', plan_expires_at: past })).toBe(false);
  });

  it('false when plan=pack but expires_at null', () => {
    expect(isPack({ plan: 'pack', plan_expires_at: null })).toBe(false);
  });

  it('false when plan=free', () => {
    expect(isPack({ plan: 'free', plan_expires_at: future })).toBe(false);
  });

  it('false when profile null or undefined', () => {
    expect(isPack(null)).toBe(false);
    expect(isPack(undefined)).toBe(false);
  });
});
