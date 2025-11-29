import { Language, LanguageConfig } from './types';

export const BACKEND_URL = 'http://localhost:3000/api/execute';
export const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

export const RECOMMENDED_SNIPPETS: Record<Language, string> = {
  [Language.PYTHON]: `print("Hello from Python!")`,
  [Language.JAVA]: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`,
  [Language.JAVASCRIPT]: `console.log("Hello from JavaScript!");`,
  [Language.TYPESCRIPT]: `const message: string = "Hello from TypeScript!";
console.log(message);`,
  [Language.HTML]: `<!DOCTYPE html>
<html>
<body>
<h1>Hello from HTML5</h1>
</body>
</html>`,
  [Language.CPP]: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    return 0;
}`,
  [Language.PHP]: `<?php
echo "Hello from PHP!";
?>`,
  [Language.GO]: `package main
import "fmt"

func main() {
    fmt.Println("Hello from Go!")
}`
};

export const LANGUAGE_CONFIGS: Record<Language, LanguageConfig> = {
  [Language.PYTHON]: {
    id: Language.PYTHON,
    name: 'Python',
    version: '3.10.0',
    extension: 'py',
    icon: 'Python'
  },
  [Language.JAVASCRIPT]: {
    id: Language.JAVASCRIPT,
    name: 'JavaScript',
    version: '18.15.0',
    extension: 'js',
    icon: 'Javascript'
  },
  [Language.TYPESCRIPT]: {
    id: Language.TYPESCRIPT,
    name: 'TypeScript',
    version: '5.0.3',
    extension: 'ts',
    icon: 'Typescript'
  },
  [Language.CPP]: {
    id: Language.CPP,
    name: 'C++',
    version: '10.2.0',
    extension: 'cpp',
    icon: 'Cpp'
  },
  [Language.JAVA]: {
    id: Language.JAVA,
    name: 'Java',
    version: '15.0.2',
    extension: 'java',
    icon: 'Java'
  },
  [Language.GO]: {
    id: Language.GO,
    name: 'Go',
    version: '1.16.2',
    extension: 'go',
    icon: 'Go'
  },
  [Language.PHP]: {
    id: Language.PHP,
    name: 'PHP',
    version: '8.2.3',
    extension: 'php',
    icon: 'Php'
  },
  [Language.HTML]: {
    id: Language.HTML,
    name: 'HTML5',
    version: '5',
    extension: 'html',
    icon: 'Html'
  }
};