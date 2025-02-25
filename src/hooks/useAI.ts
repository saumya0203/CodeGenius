import { useState, useCallback } from 'react';
import { aiService, AIAnalysisResult, CodeCompletionResult } from '../services/aiService';

export function useAI() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [completion, setCompletion] = useState<CodeCompletionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCode = useCallback(async (code: string, language: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await aiService.analyzeCode(code, language);
      setAnalysis(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const getCompletion = useCallback(async (code: string, language: string) => {
    setIsCompleting(true);
    setError(null);

    try {
      const result = await aiService.getCodeCompletion(code, language);
      setCompletion(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsCompleting(false);
    }
  }, []);

  const getSuggestions = useCallback(async (code: string, language: string) => {
    try {
      return await aiService.getSuggestions(code, language);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return [];
    }
  }, []);

  return {
    analyzeCode,
    getCompletion,
    getSuggestions,
    isAnalyzing,
    isCompleting,
    analysis,
    completion,
    error
  };
}