import { OCRService } from '../electron/services/OCRService';

describe('OCRService', () => {
  it('should extract text from an image (mocked)', async () => {
    // This is a stub. Replace 'sample.png' with a real test image path.
    const text = await OCRService.extractText('sample.png');
    expect(typeof text).toBe('string');
  });
}); 