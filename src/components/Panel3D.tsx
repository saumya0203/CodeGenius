import React from 'react';

interface Panel3DProps {
  children: React.ReactNode;
  className?: string;
  isDarkMode?: boolean;
}

export const Panel3D: React.FC<Panel3DProps> = ({
  children,
  className = '',
  isDarkMode = true
}) => {
  return (
    <div className={`
      panel-3d
      rounded-xl p-4
      ${isDarkMode ? 'glass-dark' : 'glass'}
      ${className}
    `}>
      {children}
    </div>
  );
};