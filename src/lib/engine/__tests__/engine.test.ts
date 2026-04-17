import { analyseResume } from '../index';

describe('analyseResume', () => {
  it('returns a result with score, gap, fillers', () => {
    const resume = 'Senior software engineer with 5 years experience in TypeScript, React, Node.js.';
    const jd = 'We need a senior engineer skilled in TypeScript, React, and Node.js.';
    const result = analyseResume(resume, jd);

    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('gap');
    expect(result).toHaveProperty('fillers');
    expect(result.score.score).toBeGreaterThanOrEqual(0);
    expect(result.score.score).toBeLessThanOrEqual(100);
    expect(['poor', 'moderate', 'strong']).toContain(result.score.band);
  });

  it('strong match: resume covers all JD keywords', () => {
    const resume = 'TypeScript React Node.js PostgreSQL Docker Kubernetes AWS';
    const jd = 'Looking for TypeScript React developer with PostgreSQL Docker experience';
    const result = analyseResume(resume, jd);
    expect(result.score.band).toBe('strong');
    expect(result.gap.missing.length).toBeLessThanOrEqual(1);
  });

  it('poor match: resume covers none of JD keywords', () => {
    const resume = 'Java Spring Hibernate Maven Tomcat Oracle';
    const jd = 'TypeScript React Node.js Vue Angular frontend';
    const result = analyseResume(resume, jd);
    expect(result.score.band).toBe('poor');
    expect(result.gap.missing.length).toBeGreaterThan(0);
  });

  it('detects filler phrases', () => {
    const resume = 'Hard worker who is detail-oriented and a team player with strong communication skills.';
    const jd = 'Backend engineer';
    const result = analyseResume(resume, jd);
    expect(result.fillers.length).toBeGreaterThan(0);
    expect(result.fillerCount).toBeGreaterThan(0);
  });

  it('throws for empty inputs', () => {
    expect(() => analyseResume('', '')).toThrow();
    expect(() => analyseResume('resume only', '')).toThrow();
    expect(() => analyseResume('', 'jd only')).toThrow();
  });
});
