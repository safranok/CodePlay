import lzString from 'lz-string';
import { SnippetData, Language } from '../types';
import { RECOMMENDED_SNIPPETS } from '../constants';

export const encodeSnippet = (data: SnippetData): string => {
  const json = JSON.stringify(data);
  return lzString.compressToEncodedURIComponent(json);
};

export const decodeSnippet = (hash: string): SnippetData | null => {
  try {
    if (!hash) return null;
    const cleanHash = hash.replace(/^#/, '');
    const decompressed = lzString.decompressFromEncodedURIComponent(cleanHash);
    if (!decompressed) return null;
    return JSON.parse(decompressed);
  } catch (e) {
    console.error("Failed to decode snippet", e);
    return null;
  }
};

export const getInitialState = (): SnippetData => {
  // 1. Try URL Hash
  const fromUrl = decodeSnippet(window.location.hash);
  if (fromUrl) return fromUrl;

  // 2. Try LocalStorage
  const saved = localStorage.getItem('cp_last_session');
  if (saved) {
    try {
      // Migrate old data that might have stdin
      const parsed = JSON.parse(saved);
      return {
        language: parsed.language || Language.PYTHON,
        code: parsed.code !== undefined ? parsed.code : RECOMMENDED_SNIPPETS[Language.PYTHON]
      };
    } catch (e) {
      // ignore
    }
  }

  // 3. Default (New User)
  return {
    language: Language.PYTHON,
    code: RECOMMENDED_SNIPPETS[Language.PYTHON]
  };
};