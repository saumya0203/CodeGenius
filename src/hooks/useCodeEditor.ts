import { useState, useCallback } from 'react';
import { getTemplateForLanguage, CodeTemplate } from '../services/codeTemplates';

export function useCodeEditor(initialLanguage: string = 'javascript') {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(initialLanguage);
  const [templates, setTemplates] = useState(getTemplateForLanguage(initialLanguage));
  const [scrollInfo, setScrollInfo] = useState({ scrollTop: 0, scrollHeight: 0 });

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    setTemplates(getTemplateForLanguage(newLanguage));
  }, []);

  const handleTemplateSelect = useCallback((template: CodeTemplate) => {
    setCode(template.code);
  }, []);

  const handleScroll = useCallback((info: { scrollTop: number; scrollHeight: number }) => {
    setScrollInfo(info);
  }, []);

  return {
    code,
    setCode,
    language,
    setLanguage: handleLanguageChange,
    templates,
    handleTemplateSelect,
    scrollInfo,
    handleScroll
  };
}