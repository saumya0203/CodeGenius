import React, { useState, useEffect } from 'react';
import { useCompiler } from './hooks/useCompiler';
import { useCodeEditor } from './hooks/useCodeEditor';
import { useAI } from './hooks/useAI';
import { CodeEditor } from './components/CodeEditor';
import { Button3D } from './components/Button3D';
import { Panel3D } from './components/Panel3D';
import { TemplateSelector } from './components/TemplateSelector';
import {
  Sun, Moon, Play, Bug, TestTube, Braces, Settings, Languages,
  Lightbulb, PackagePlus, MessageSquareMore, Sparkles, Code2,
  Bot, Zap, Search, PanelRightClose, PanelRightOpen, Utensils as Extension,
  GitBranch, Terminal, Database, Cloud, Share2, Command, FileJson,
  Cpu, Network, Shield, Workflow, XCircle, Wand2
} from 'lucide-react';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [codeDescription, setCodeDescription] = useState('');

  const {
    code,
    setCode,
    language,
    setLanguage,
    templates,
    handleTemplateSelect,
    handleScroll
  } = useCodeEditor('javascript');

  const {
    compile,
    debug,
    clearDebugSession,
    isCompiling,
    isDebugging,
    result,
    debugSession,
    error: compileError
  } = useCompiler();

  const {
    analyzeCode,
    getCompletion,
    getSuggestions,
    isAnalyzing,
    isCompleting,
    analysis,
    completion,
    error: aiError
  } = useAI();

  const features = [
    { name: 'Version Control', icon: GitBranch, color: 'text-green-500' },
    { name: 'Terminal', icon: Terminal, color: 'text-purple-500' },
    { name: 'Database', icon: Database, color: 'text-blue-500' },
    { name: 'Cloud Deploy', icon: Cloud, color: 'text-sky-500' },
    { name: 'Collaboration', icon: Share2, color: 'text-pink-500' },
    { name: 'Commands', icon: Command, color: 'text-yellow-500' },
    { name: 'API Testing', icon: FileJson, color: 'text-orange-500' },
    { name: 'Performance', icon: Cpu, color: 'text-red-500' },
    { name: 'Network', icon: Network, color: 'text-indigo-500' },
    { name: 'Security', icon: Shield, color: 'text-emerald-500' },
    { name: 'Workflows', icon: Workflow, color: 'text-violet-500' }
  ];

  const handleRunCode = async () => {
    try {
      await compile(code, language);
    } catch (error) {
      console.error('Error running code:', error);
    }
  };

  const handleDebugCode = async () => {
    try {
      await debug(code, language, []);
    } catch (error) {
      console.error('Error debugging code:', error);
    }
  };

  const handleGenerateCode = async () => {
    if (!codeDescription) return;
    setIsThinking(true);
    try {
      const suggestions = await getSuggestions(code, language);
      const completion = await getCompletion(code, language);
      if (completion) {
        setCode(prev => prev + '\n' + completion.completion);
      }
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCodeAnalysis = async () => {
    try {
      await analyzeCode(code, language);
    } catch (error) {
      console.error('Error analyzing code:', error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        handleRunCode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [code, language]);

  return (
    <div className={`min-h-screen w-full fixed inset-0 ${isDarkMode ? 'bg-[#0A1929]' : 'bg-gray-50'}`}>
      {/* Top Navigation Bar */}
      <Panel3D isDarkMode={isDarkMode} className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code2 size={28} className="text-blue-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              CodeGenius AI
            </h1>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-[#1A365D]' : 'bg-white'} border ${isDarkMode ? 'border-[#1A365D]' : 'border-gray-200'}`}>
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search in code or press Ctrl + P to search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-transparent border-none focus:outline-none text-sm w-96 ${isDarkMode ? 'placeholder-gray-500 text-gray-200' : 'placeholder-gray-400 text-gray-900'}`}
            />
            <kbd className={`px-2 py-0.5 text-xs rounded ${isDarkMode ? 'bg-[#0A1929] text-gray-300' : 'bg-gray-100 text-gray-600'}`}>⌘P</kbd>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button3D
            icon={showAIPanel ? PanelRightClose : PanelRightOpen}
            onClick={() => setShowAIPanel(!showAIPanel)}
            variant="secondary"
          >
            AI Assistant
          </Button3D>
          <Button3D
            icon={Extension}
            variant="primary"
          >
            Extensions
          </Button3D>
          <Button3D
            icon={Settings}
            variant="primary"
          >
            Settings
          </Button3D>
          <Button3D
            icon={isDarkMode ? Sun : Moon}
            onClick={() => setIsDarkMode(!isDarkMode)}
            variant="primary"
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </Button3D>
        </div>
      </Panel3D>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Features */}
        <Panel3D isDarkMode={isDarkMode} className="w-16 flex flex-col items-center py-6 space-y-6">
          {features.map((feature, index) => (
            <button
              key={index}
              className={`p-3 rounded-lg transition-all ${isDarkMode ? 'hover:bg-[#1A365D]' : 'hover:bg-gray-200'} group relative button-3d`}
              title={feature.name}
            >
              <div className={feature.color}>
                <feature.icon size={20} />
              </div>
              <div className={`absolute left-16 top-1/2 -translate-y-1/2 px-2 py-1 rounded ${isDarkMode ? 'bg-[#1A365D] text-gray-200' : 'bg-gray-700 text-white'} text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50`}>
                {feature.name}
              </div>
            </button>
          ))}
        </Panel3D>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Language Selector and Actions */}
          <Panel3D isDarkMode={isDarkMode} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-3 px-3 py-1.5 rounded-lg ${isDarkMode ? 'bg-[#1A365D]' : 'bg-white'} border ${isDarkMode ? 'border-[#1A365D]' : 'border-gray-200'}`}>
                  <Languages size={20} className="text-blue-500" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={`rounded-lg py-1 px-2 ${isDarkMode ? 'bg-[#1A365D] text-gray-200' : 'bg-white text-gray-900'} border-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <Button3D
                    icon={Play}
                    onClick={handleRunCode}
                    disabled={isCompiling}
                    variant="success"
                  >
                    {isCompiling ? 'Running...' : 'Run'}
                  </Button3D>
                  <Button3D
                    icon={Bug}
                    onClick={handleDebugCode}
                    disabled={isDebugging}
                    variant="secondary"
                  >
                    {isDebugging ? 'Debugging...' : 'Debug'}
                  </Button3D>
                  <Button3D
                    icon={TestTube}
                    variant="primary"
                  >
                    Test
                  </Button3D>
                  <Button3D
                    icon={Wand2}
                    onClick={handleGenerateCode}
                    disabled={isThinking}
                    variant="warning"
                  >
                    {isThinking ? 'Thinking...' : 'Generate'}
                  </Button3D>
                </div>
              </div>
            </div>
          </Panel3D>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              code={code}
              language={language}
              onChange={setCode}
              onScroll={handleScroll}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Output Panel */}
          {(result || compileError || analysis) && (
            <Panel3D isDarkMode={isDarkMode} className="h-48 overflow-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Output
                </h3>
                <Button3D
                  icon={XCircle}
                  onClick={() => { clearDebugSession(); }}
                  variant="danger"
                  className="!p-1"
                >
                  Close
                </Button3D>
              </div>
              <pre className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {compileError ? (
                  <span className="text-red-500">{compileError}</span>
                ) : analysis ? (
                  <div>
                    {analysis.errors.map((error, i) => (
                      <div key={i} className="text-red-500">
                        Line {error.line}: {error.message}
                      </div>
                    ))}
                    {analysis.suggestions.map((suggestion, i) => (
                      <div key={i} className="text-blue-500">
                        Line {suggestion.line}: {suggestion.suggestion}
                      </div>
                    ))}
                  </div>
                ) : (
                  result?.output || 'No output'
                )}
              </pre>
            </Panel3D>
          )}
        </div>

        {/* Right Sidebar - Debug Panel */}
        {debugSession && (
          <Panel3D isDarkMode={isDarkMode} className="w-80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Bug size={24} className="text-purple-500" />
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Debug</h2>
              </div>
              <Button3D
                icon={XCircle}
                onClick={clearDebugSession}
                variant="danger"
                className="!p-1"
              >
                Close
              </Button3D>
            </div>
            
            <div className="space-y-4">
              {/* Variables */}
              <Panel3D isDarkMode={isDarkMode} className="space-y-2">
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Variables</h3>
                <div className="space-y-2">
                  {Object.entries(debugSession.variables).map(([name, value]) => (
                    <div key={name} className="flex justify-between">
                      <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{name}</span>
                      <span className={`font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </Panel3D>

              {/* Stack Trace */}
              <Panel3D isDarkMode={isDarkMode} className="space-y-2">
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Stack Trace</h3>
                <div className="space-y-1 font-mono text-sm">
                  {debugSession.stackTrace.map((line, index) => (
                    <div 
                      key={index}
                      className={`${
                        index === debugSession.currentLine 
                          ? isDarkMode 
                            ? 'bg-blue-900 text-blue-200' 
                            : 'bg-blue-100 text-blue-900'
                          : ''
                      } px-2 py-1 rounded`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </Panel3D>
            </div>
          </Panel3D>
        )}

        {/* Right Sidebar - AI Assistant */}
        {showAIPanel && (
          <Panel3D isDarkMode={isDarkMode} className="w-96">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Bot size={24} className="text-blue-500" />
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>AI Assistant</h2>
              </div>
              <div className={`flex items-center space-x-2 ${isThinking ? 'float' : ''}`}>
                <Sparkles size={20} className="text-yellow-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isThinking ? 'Thinking...' : 'Ready to help'}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Code Generation */}
              <Panel3D isDarkMode={isDarkMode} className="space-y-4">
                <h3 className={`font-medium flex items-center space-x-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  <Wand2 size={18} className="text-purple-500" />
                  <span>Code Generation</span>
                </h3>
                <div className="space-y-3">
                  <textarea
                    value={codeDescription}
                    onChange={(e) => setCodeDescription(e.target.value)}
                    placeholder="Describe what code you want to generate..."
                    className={`w-full p-3 rounded-lg ${
                      isDarkMode 
                        ? 'bg-[#0A1929] text-gray-200 placeholder-gray-500' 
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                    } border ${isDarkMode ? 'border-[#1A365D]' : 'border-gray-200'}`}
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <Button3D
                      icon={Wand2}
                      onClick={handleGenerateCode}
                      disabled={isThinking || !codeDescription}
                      variant="secondary"
                      className="flex-1"
                    >
                      {isThinking ? 'Generating...' : 'Generate Code'}
                    </Button3D>
                    <Button3D
                      icon={Sparkles}
                      onClick={handleCodeAnalysis}
                      disabled={isAnalyzing}
                      variant="primary"
                    >
                      Analyze
                    </Button3D>
                  </div>
                </div>
              </Panel3D>

              {/* Templates */}
              <TemplateSelector
                templates={templates}
                onSelect={handleTemplateSelect}
                isDarkMode={isDarkMode}
              />

              {/* Smart Suggestions */}
              <Panel3D isDarkMode={isDarkMode} className="space-y-3">
                <h3 className={`font-medium flex items-center space-x-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  <Zap size={18} className="text-blue-500" />
                  <span>Smart Suggestions</span>
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500">•</span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Try describing the functionality you want to implement
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500">•</span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Use natural language to explain your requirements
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-500">•</span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Specify any particular patterns or best practices you want to follow
                    </span>
                  </li>
                </ul>
              </Panel3D>
            </div>
          </Panel3D>
        )}
      </div>
    </div>
  );
}

export default App;