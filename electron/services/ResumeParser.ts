// ResumeParser.ts
// Parses PDF or DOCX resumes for key fields
import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * ResumeParser provides static methods to parse PDF or DOCX resumes for key fields (name, skills, etc.).
 */
export class ResumeParser {
  /**
   * Parses the given resume file for key fields such as name and skills.
   * @param filePath - The path to the resume file (PDF or DOCX).
   * @returns An object containing the parsed name and skills.
   */
  static async parse(filePath: string): Promise<{ name: string; skills: string[] }> {
    const ext = path.extname(filePath).toLowerCase();
    let text = '';
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      throw new Error('Unsupported file type');
    }
    // Simple extraction: first line as name, lines with 'skills' as skills
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const name = lines[0] || '';
    const skillsLine = lines.find(l => /skills/i.test(l));
    const skills = skillsLine ? skillsLine.replace(/skills[:\s]*/i, '').split(/,|;/).map(s => s.trim()).filter(Boolean) : [];
    return { name, skills };
  }
}

// Register IPC handler for resume parsing requests from renderer process.
ipcMain.handle('parse-resume', async (event, filePath) => {
  return await ResumeParser.parse(filePath);
}); 