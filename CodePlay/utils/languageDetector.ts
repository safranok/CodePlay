import { Language } from '../types';

export const detectLanguage = (code: string): Language | null => {
  if (!code || !code.trim()) return null;

  const patterns: Record<string, Language> = {
    // Python
    'def ': Language.PYTHON,
    'import sys': Language.PYTHON,
    'print(': Language.PYTHON,
    'if __name__ ==': Language.PYTHON,
    
    // C++
    '#include <iostream>': Language.CPP,
    'using namespace std': Language.CPP,
    'int main()': Language.CPP,
    
    // Java
    'public class Main': Language.JAVA,
    'System.out.println': Language.JAVA,
    
    // HTML
    '<!DOCTYPE html>': Language.HTML,
    '<html>': Language.HTML,
    
    // Go
    'package main': Language.GO,
    'func main()': Language.GO,
    
    // PHP
    '<?php': Language.PHP,
    
    // JS/TS - Harder to distinguish, usually fallback
    'console.log': Language.JAVASCRIPT,
    'const ': Language.JAVASCRIPT,
    'interface ': Language.TYPESCRIPT,
    ': number': Language.TYPESCRIPT,
    ': string': Language.TYPESCRIPT,
  };

  for (const [pattern, lang] of Object.entries(patterns)) {
    if (code.includes(pattern)) {
      return lang;
    }
  }

  return null;
};