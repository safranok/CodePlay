import { Language } from '../types';

export const requiresInput = (language: Language, code: string): boolean => {
  return getInputPrompts(language, code).length > 0;
};

export const getInputPrompts = (language: Language, code: string): string[] => {
  if (!code) return [];
  
  const prompts: string[] = [];
  let matches;

  switch (language) {
    case Language.PYTHON:
      // Match input("prompt") or input('prompt')
      // capturing group 2 is the content inside quotes
      const pyRegex = /input\s*\(\s*(['"])((?:[^'"]|\\'|\\")*)\1\s*\)/g;
      while ((matches = pyRegex.exec(code)) !== null) {
        prompts.push(matches[2]); // The text inside quotes
      }
      
      // Match empty input() - if it wasn't caught by above (because of quotes)
      // We need to be careful not to double count.
      // Actually, let's just find all 'input(' occurrences and see if they have quotes.
      // Simpler approach: Find ALL input() calls.
      
      const allPyInputs = [...code.matchAll(/input\s*\(/g)];
      if (allPyInputs.length > prompts.length) {
         // Fill the difference with generic prompts
         const diff = allPyInputs.length - prompts.length;
         for(let i=0; i<diff; i++) prompts.push("Input:");
      }
      
      // Fallback for sys.stdin usage
      if (prompts.length === 0 && /sys\.stdin/.test(code)) {
         prompts.push("Stdin Input:");
      }
      break;
      
    case Language.JAVASCRIPT:
    case Language.TYPESCRIPT:
      // Match readline.question("prompt")
      const jsRegex = /question\s*\(\s*(['"])((?:[^'"]|\\'|\\")*)\1/g;
      while ((matches = jsRegex.exec(code)) !== null) {
        prompts.push(matches[2]);
      }
      // Heuristic for other input methods
      if (prompts.length === 0 && (/process\.stdin/.test(code) || /readline/.test(code))) {
         prompts.push("Input:");
      }
      break;
      
    case Language.JAVA:
      // Count Scanner.next calls
      const javaMatches = code.match(/\.next(Line|Int|Double|Boolean)?\s*\(/g);
      if (javaMatches) {
        javaMatches.forEach(() => prompts.push("Input:"));
      }
      break;
      
    case Language.CPP:
      // Count cin >> calls
      const cppMatches = code.match(/cin\s*>>/g);
      if (cppMatches) {
        cppMatches.forEach(() => prompts.push("Input:"));
      }
      break;
      
    case Language.GO:
      const goMatches = code.match(/fmt\.Scan/g);
      if (goMatches) {
         goMatches.forEach(() => prompts.push("Input:"));
      }
      break;

    case Language.PHP:
       if (/php:\/\/stdin/.test(code) || /fgets/.test(code)) {
          prompts.push("Input:");
       }
       break;
  }

  return prompts;
};