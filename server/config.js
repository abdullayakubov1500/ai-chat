import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { shopConfig } from '../shared/shopConfig.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(rootDir, '.env') });

export const config = {
  port: Number(process.env.PORT) || 3001,
  geminiApiKey: process.env.GEMINI_API_KEY?.trim() || '',
  geminiModel: process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash',
  workshopPhone: process.env.WORKSHOP_PHONE?.trim() || shopConfig.workshopPhone,
};
