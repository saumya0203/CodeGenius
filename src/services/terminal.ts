import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Socket, io } from 'socket.io-client';

export class TerminalService {
  private terminal: Terminal;
  private fitAddon: FitAddon;
  private socket: Socket;

  constructor(containerId: string) {
    this.terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'JetBrains Mono',
      theme: {
        background: '#0A1929',
        foreground: '#ffffff'
      }
    });

    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);

    this.socket = io('wss://terminal.codegenius.ai', {
      transports: ['websocket'],
      autoConnect: false
    });

    const container = document.getElementById(containerId);
    if (container) {
      this.terminal.open(container);
      this.fitAddon.fit();
    }

    this.initializeSocketHandlers();
  }

  private initializeSocketHandlers(): void {
    this.socket.on('connect', () => {
      this.terminal.write('\r\n🚀 Connected to terminal server\r\n');
    });

    this.socket.on('output', (data: string) => {
      this.terminal.write(data);
    });

    this.socket.on('disconnect', () => {
      this.terminal.write('\r\n❌ Disconnected from terminal server\r\n');
    });

    this.terminal.onData((data) => {
      this.socket.emit('input', data);
    });
  }

  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public clear(): void {
    this.terminal.clear();
  }

  public write(data: string): void {
    this.terminal.write(data);
  }

  public focus(): void {
    this.terminal.focus();
  }

  public onResize(): void {
    this.fitAddon.fit();
  }
}

export const createTerminal = (containerId: string): TerminalService => {
  return new TerminalService(containerId);
};