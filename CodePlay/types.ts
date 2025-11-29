export enum Language {
  PYTHON = 'python',
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  JAVA = 'java',
  CPP = 'cpp',
  GO = 'go',
  PHP = 'php',
  HTML = 'html'
}

export interface LanguageConfig {
  id: Language;
  name: string;
  version: string; // Piston version
  extension: string;
  icon: string; // Lucide icon name placeholder
}

export interface ExecutionResult {
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
  language?: string;
  version?: string;
  message?: string; // For errors
}

export interface CodeSnippet {
  name: string;
  description: string;
  code: string;
}

// Payload for our custom backend
export interface BackendExecutionRequest {
  language: Language;
  code: string;
  stdin?: string;
}

// Payload for direct Piston API (Fallback)
export interface PistonExecutionRequest {
  language: Language;
  version: string;
  files:Array<{
    name?: string;
    content: string;
  }>;
  stdin?: string;
}

export interface SnippetData {
  language: Language;
  code: string;
}

export interface ExecutionStat {
  timestamp: string;
  duration: number; // in ms
  language: string;
  status: 'success' | 'error';
}