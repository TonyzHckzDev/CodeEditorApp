export class LanguageManager {
  constructor() {
    this.languages = {
      javascript: {
        name: 'JavaScript',
        extension: 'js',
        mime: 'text/javascript',
        defaultCode: '// Votre code JavaScript ici\nconsole.log("Hello, World!");',
      },
      typescript: {
        name: 'TypeScript',
        extension: 'ts',
        mime: 'text/typescript',
        defaultCode: '// Votre code TypeScript ici\nconsole.log("Hello, World!");',
      },
      python: {
        name: 'Python',
        extension: 'py',
        mime: 'text/x-python',
        defaultCode: '# Votre code Python ici\nprint("Hello, World!")',
      },
      java: {
        name: 'Java',
        extension: 'java',
        mime: 'text/x-java',
        defaultCode:
          'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      },
      cpp: {
        name: 'C++',
        extension: 'cpp',
        mime: 'text/x-c++src',
        defaultCode:
          '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
      },
      csharp: {
        name: 'C#',
        extension: 'cs',
        mime: 'text/x-csharp',
        defaultCode:
          'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
      },
      go: {
        name: 'Go',
        extension: 'go',
        mime: 'text/x-go',
        defaultCode:
          'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
      },
      rust: {
        name: 'Rust',
        extension: 'rs',
        mime: 'text/x-rust',
        defaultCode: 'fn main() {\n    println!("Hello, World!");\n}',
      },
      php: {
        name: 'PHP',
        extension: 'php',
        mime: 'text/x-php',
        defaultCode: '<?php\necho "Hello, World!";\n?>',
      },
      ruby: {
        name: 'Ruby',
        extension: 'rb',
        mime: 'text/x-ruby',
        defaultCode: 'puts "Hello, World!"',
      },
      swift: {
        name: 'Swift',
        extension: 'swift',
        mime: 'text/x-swift',
        defaultCode: 'print("Hello, World!")',
      },
      kotlin: {
        name: 'Kotlin',
        extension: 'kt',
        mime: 'text/x-kotlin',
        defaultCode: 'fun main() {\n    println("Hello, World!")\n}',
      },
      html: {
        name: 'HTML',
        extension: 'html',
        mime: 'text/html',
        defaultCode:
          '<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
      },
      css: {
        name: 'CSS',
        extension: 'css',
        mime: 'text/css',
        defaultCode:
          'body {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}',
      },
      sql: {
        name: 'SQL',
        extension: 'sql',
        mime: 'text/x-sql',
        defaultCode: '-- Votre requête SQL ici\nSELECT * FROM users;',
      },
      markdown: {
        name: 'Markdown',
        extension: 'md',
        mime: 'text/markdown',
        defaultCode: '# Titre\n\nCeci est un paragraphe en **Markdown**.\n\n- Liste\n- À\n- Puces',
      },
    };
  }

  getLanguage(id) {
    return this.languages[id];
  }

  getAllLanguages() {
    return Object.entries(this.languages).map(([id, lang]) => ({
      id,
      ...lang,
    }));
  }

  getDefaultCode(languageId) {
    return this.languages[languageId]?.defaultCode || '';
  }

  getFileExtension(languageId) {
    return this.languages[languageId]?.extension || 'txt';
  }

  getMimeType(languageId) {
    return this.languages[languageId]?.mime || 'text/plain';
  }

  isLanguageSupported(languageId) {
    return !!this.languages[languageId];
  }
}
