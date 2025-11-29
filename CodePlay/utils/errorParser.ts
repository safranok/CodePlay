import { Language } from '../types';

export interface ErrorAnalysis {
  friendly: string;
  isHint: boolean;
  line?: number;
}

export const analyzeError = (language: Language, stderr: string): ErrorAnalysis | null => {
  if (!stderr) return null;

  const lowerErr = stderr.toLowerCase();
  let line: number | undefined;

  // 1. Extract Line Number based on Language Regex
  try {
    switch (language) {
      case Language.PYTHON: {
        const match = stderr.match(/File ".*", line (\d+)/);
        if (match) line = parseInt(match[1], 10);
        break;
      }
      case Language.JAVASCRIPT:
      case Language.TYPESCRIPT: {
        // Matches /path/to/file:Line:Col or just :Line:Col
        const match = stderr.match(/:(\d+):\d+/);
        if (match) line = parseInt(match[1], 10);
        break;
      }
      case Language.JAVA: {
        const match = stderr.match(/Main\.java:(\d+):/);
        if (match) line = parseInt(match[1], 10);
        break;
      }
      case Language.CPP: {
        // Matches :Line:Col: error:
        const match = stderr.match(/:(\d+):\d+/);
        if (match) line = parseInt(match[1], 10);
        break;
      }
      case Language.PHP: {
        const match = stderr.match(/on line (\d+)/);
        if (match) line = parseInt(match[1], 10);
        break;
      }
      case Language.GO: {
        const match = stderr.match(/:(\d+):/);
        if (match) line = parseInt(match[1], 10);
        break;
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }

  // 2. Determine Friendly Error Message
  let friendly = "";
  let isHint = false;

  switch (language) {
    case Language.PYTHON:
      if (lowerErr.includes('syntaxerror')) {
        friendly = "Python Syntax Error: Check for missing colons (:), mismatched parentheses, or incorrect indentation.";
        isHint = true;
      } else if (lowerErr.includes('nameerror')) {
        friendly = "Python Name Error: You are trying to use a variable or function that hasn't been defined yet.";
        isHint = true;
      } else if (lowerErr.includes('indentationerror')) {
        friendly = "Indentation Error: Python relies on indentation. Ensure your code blocks are aligned correctly.";
        isHint = true;
      }
      break;

    case Language.JAVASCRIPT:
    case Language.TYPESCRIPT:
      if (lowerErr.includes('unexpected token') || lowerErr.includes('syntaxerror')) {
        friendly = "JavaScript Syntax Error: Check for missing brackets }, parentheses ), or semicolons ;.";
        isHint = true;
      } else if (lowerErr.includes('referenceerror')) {
        friendly = "Reference Error: You are using a variable that doesn't exist.";
        isHint = true;
      }
      break;

    case Language.JAVA:
      if (lowerErr.includes('cannot find symbol')) {
        friendly = "Java Error: Compiler cannot find a variable or class. Check spelling or missing imports.";
        isHint = true;
      } else if (lowerErr.includes('expected')) {
        friendly = "Java Syntax Error: Usually missing a semicolon ; or a closing brace }.";
        isHint = true;
      } else if (lowerErr.includes('class') && lowerErr.includes('public') && lowerErr.includes('should be declared in a file')) {
        friendly = "Class Name Error: In this environment, ensure your public class is named 'Main'.";
        isHint = true;
      }
      break;

    case Language.CPP:
      if (lowerErr.includes('expected')) {
        friendly = "C++ Syntax Error: Likely missing a semicolon ; or incorrect bracket usage.";
        isHint = true;
      } else if (lowerErr.includes('undeclared identifier')) {
        friendly = "Undeclared Identifier: You forgot to declare a variable or include a necessary library (like <iostream>).";
        isHint = true;
      }
      break;
  }

  // If no friendly message was found, but we have a line number, we still return the object
  if (!friendly && !line) return null;

  return { friendly, isHint, line };
};