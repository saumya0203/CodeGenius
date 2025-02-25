import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Button3DProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
  className?: string;
}

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white'
};

export const Button3D: React.FC<Button3DProps> = ({
  icon: Icon,
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        button-3d
        flex items-center space-x-2 px-4 py-2 rounded-lg
        transition-all duration-200
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {Icon && <Icon size={16} />}
      <span>{children}</span>
    </button>
  );
};