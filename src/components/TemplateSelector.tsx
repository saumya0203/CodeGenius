import React from 'react';
import { CodeTemplate } from '../services/codeTemplates';
import { FileCode2 } from 'lucide-react';
import { Panel3D } from './Panel3D';

interface TemplateSelectorProps {
  templates: CodeTemplate[];
  onSelect: (template: CodeTemplate) => void;
  isDarkMode: boolean;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onSelect,
  isDarkMode
}) => {
  return (
    <Panel3D isDarkMode={isDarkMode} className="space-y-3">
      <h3 className={`font-medium flex items-center space-x-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
        <FileCode2 size={18} className="text-blue-500" />
        <span>Code Templates</span>
      </h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => onSelect(template)}
            className={`
              button-3d w-full text-left p-3 rounded-lg
              ${isDarkMode 
                ? 'hover:bg-[#0A1929] text-gray-300' 
                : 'hover:bg-gray-100 text-gray-700'}
            `}
          >
            <div className="font-medium mb-1">{template.name}</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {template.description}
            </div>
          </button>
        ))}
      </div>
    </Panel3D>
  );
};