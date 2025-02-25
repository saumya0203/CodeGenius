import { useEffect, useRef } from 'react';
import { TerminalService, createTerminal } from '../services/terminal';

export function useTerminal(containerId: string) {
  const terminalRef = useRef<TerminalService | null>(null);

  useEffect(() => {
    if (!terminalRef.current) {
      terminalRef.current = createTerminal(containerId);
      terminalRef.current.connect();
    }

    const handleResize = () => {
      terminalRef.current?.onResize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      terminalRef.current?.disconnect();
    };
  }, [containerId]);

  return terminalRef.current;
}