import React, { useRef, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
  onScroll?: (scrollInfo: { scrollTop: number; scrollHeight: number }) => void;
  height?: string;
  isDarkMode: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onChange,
  onScroll,
  height = '100%',
  isDarkMode
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      onScroll?.({
        scrollTop: target.scrollTop,
        scrollHeight: target.scrollHeight
      });
    };

    const editorElement = editorRef.current?.querySelector('.prism-editor__textarea');
    if (editorElement) {
      editorElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [onScroll]);

  return (
    <div 
      ref={editorRef}
      className="editor-3d w-full h-full"
      style={{ height }}
    >
      <Editor
        value={code}
        onValueChange={onChange}
        highlight={code => highlight(code, languages[language] || languages.javascript)}
        padding={20}
        className="code-font w-full h-full overflow-auto"
        style={{
          fontSize: 14,
          fontFamily: '"JetBrains Mono", monospace',
          backgroundColor: isDarkMode ? '#0A1929' : '#f9fafb',
          color: isDarkMode ? '#f3f4f6' : '#1f2937',
          minHeight: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};