import axios from 'axios';

const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

export interface CompilationResult {
  success: boolean;
  output?: string;
  error?: string;
  warnings?: string[];
  executionTime?: number;
  memoryUsage?: number;
}

export interface DebugSession {
  sessionId: string;
  breakpoints: number[];
  variables: Record<string, any>;
  stackTrace: string[];
  currentLine: number;
}

export class CompilerService {
  private readonly supportedLanguages = new Map([
    ['typescript', 'typescript'],
    ['javascript', 'nodejs'],
    ['python', 'python3'],
    ['java', 'java'],
    ['cpp', 'c++'],
    ['go', 'go'],
    ['rust', 'rust'],
    ['kotlin', 'kotlin'],
    ['ruby', 'ruby'],
    ['scala', 'scala'],
    ['r', 'r']
  ]);

  public async compile(code: string, language: string): Promise<CompilationResult> {
    if (!this.supportedLanguages.has(language)) {
      throw new Error(`Unsupported language: ${language}`);
    }

    try {
      const pistonLanguage = this.supportedLanguages.get(language);
      
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: pistonLanguage,
        version: '*',
        files: [{
          name: `main.${this.getFileExtension(language)}`,
          content: code
        }]
      });

      if (response.data.run) {
        return {
          success: true,
          output: response.data.run.output,
          executionTime: response.data.run.time,
          memoryUsage: response.data.run.memory
        };
      } else if (response.data.compile) {
        return {
          success: false,
          error: response.data.compile.stderr || response.data.compile.output,
        };
      }

      return {
        success: false,
        error: 'Unknown error occurred'
      };
    } catch (error) {
      console.error('Compilation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  public async debug(code: string, language: string, breakpoints: number[]): Promise<DebugSession> {
    const session: DebugSession = {
      sessionId: crypto.randomUUID(),
      breakpoints,
      variables: {},
      stackTrace: [],
      currentLine: 0
    };

    try {
      const compilationResult = await this.compile(code, language);
      
      if (!compilationResult.success) {
        throw new Error(compilationResult.error || 'Compilation failed');
      }

      const lines = code.split('\n');
      session.stackTrace = lines.map((line, index) => `${index + 1}: ${line}`);

      const variableRegex = /(?:let|const|var)\s+(\w+)\s*=\s*([^;]+)/g;
      let match;
      while ((match = variableRegex.exec(code)) !== null) {
        session.variables[match[1]] = match[2];
      }

      return session;
    } catch (error) {
      console.error('Debug error:', error);
      throw error;
    }
  }

  private getFileExtension(language: string): string {
    const extensions: Record<string, string> = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      go: 'go',
      rust: 'rs',
      kotlin: 'kt',
      ruby: 'rb',
      scala: 'scala',
      r: 'r'
    };
    return extensions[language] || language;
  }
}

export const compiler = new CompilerService();