import { ResumeParser } from '../electron/services/ResumeParser';

describe('ResumeParser', () => {
  it('should parse name and skills from PDF/DOCX (mocked)', async () => {
    // This is a stub. Replace 'sample.pdf' with a real test file.
    const result = await ResumeParser.parse('sample.pdf');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('skills');
    expect(Array.isArray(result.skills)).toBe(true);
  });
}); 