import { useState, useCallback } from 'react';
import { compiler, CompilationResult, DebugSession } from '../services/compiler';

export function useCompiler() {
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [result, setResult] = useState<CompilationResult | null>(null);
  const [debugSession, setDebugSession] = useState<DebugSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compile = useCallback(async (code: string, language: string) => {
    setIsCompiling(true);
    setError(null);
    
    try {
      const compilationResult = await compiler.compile(code, language);
      setResult(compilationResult);
      return compilationResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsCompiling(false);
    }
  }, []);

  const debug = useCallback(async (code: string, language: string, breakpoints: number[]) => {
    setIsDebugging(true);
    setError(null);

    try {
      const session = await compiler.debug(code, language, breakpoints);
      setDebugSession(session);
      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsDebugging(false);
    }
  }, []);

  const clearDebugSession = useCallback(() => {
    setDebugSession(null);
  }, []);

  return {
    compile,
    debug,
    clearDebugSession,
    isCompiling,
    isDebugging,
    result,
    debugSession,
    error
  };
}