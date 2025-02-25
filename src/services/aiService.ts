import { Pipeline, pipeline } from '@xenova/transformers';
import axios from 'axios';

export interface AIAnalysisResult {
  errors: Array<{
    line: number;
    message: string;
    severity: 'error' | 'warning';
    suggestions?: string[];
  }>;
  suggestions: Array<{
    line: number;
    suggestion: string;
    confidence: number;
  }>;
}

export interface CodeCompletionResult {
  completion: string;
  confidence: number;
}

class AIService {
  private codeLlamaPipeline: Pipeline | null = null;
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

  private async initializeCodeLlama() {
    if (this.isInitializing) {
      return this.initPromise;
    }

    this.isInitializing = true;
    this.initPromise = (async () => {
      try {
        this.codeLlamaPipeline = await pipeline('text-generation', 'Xenova/codellama-7b-instruct-hf');
      } catch (error) {
        console.error('Failed to initialize Code Llama:', error);
        throw error;
      } finally {
        this.isInitializing = false;
      }
    })();

    return this.initPromise;
  }

  public async analyzeCode(code: string, language: string): Promise<AIAnalysisResult> {
    try {
      const response = await axios.post('https://emkc.org/api/v2/piston/analyze', {
        language,
        source: code
      });

      const analysis = response.data;
      return {
        errors: analysis.diagnostics.map((diagnostic: any) => ({
          line: diagnostic.line,
          message: diagnostic.message,
          severity: diagnostic.severity,
          suggestions: diagnostic.suggestions
        })),
        suggestions: analysis.suggestions.map((suggestion: any) => ({
          line: suggestion.line,
          suggestion: suggestion.text,
          confidence: suggestion.confidence
        }))
      };
    } catch (error) {
      console.error('Error analyzing code:', error);
      return {
        errors: [],
        suggestions: []
      };
    }
  }

  public async getCodeCompletion(code: string, language: string): Promise<CodeCompletionResult> {
    if (!this.codeLlamaPipeline) {
      await this.initializeCodeLlama();
    }

    try {
      const prompt = `Complete the following ${language} code:\n\n${code}\n\nCompletion:`;
      const result = await this.codeLlamaPipeline!.generate(prompt, {
        max_new_tokens: 128,
        temperature: 0.7,
        top_p: 0.95
      });

      const completion = result[0].generated_text;
      return {
        completion: completion.substring(prompt.length).trim(),
        confidence: result[0].score
      };
    } catch (error) {
      console.error('Error getting code completion:', error);
      throw error;
    }
  }

  public async getSuggestions(code: string, language: string): Promise<string[]> {
    if (!this.codeLlamaPipeline) {
      await this.initializeCodeLlama();
    }

    try {
      const prompt = `Suggest improvements for the following ${language} code:\n\n${code}\n\nSuggestions:`;
      const result = await this.codeLlamaPipeline!.generate(prompt, {
        max_new_tokens: 256,
        temperature: 0.7,
        top_p: 0.95
      });

      const suggestions = result[0].generated_text
        .substring(prompt.length)
        .trim()
        .split('\n')
        .filter(Boolean);

      return suggestions;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }
}

export const aiService = new AIService();