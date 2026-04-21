// WebSocketClient.ts
import * as Commands from './Command/commands';
export class WebSocketClient {
    private ws: WebSocket | null = null;
    private url: string;
    private reconnectInterval: number = 3000;
    private maxReconnectAttempts: number = 5;
    private reconnectAttempts: number = 0;

    // 回調函數
    public onOpen?: (event: Event) => void;
    public onMessage?: (data: any) => void; // 假設傳 JSON
    public onError?: (event: Event) => void;
    public onClose?: (code: number, reason: string) => void;

    constructor(url: string) {
        this.url = url;
    }

    connect(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket 已連線，無需重複連接');
            return;
        }

        this.ws = new WebSocket(this.url);

        this.ws.onopen = (event) => {
            this.reconnectAttempts = 0; // 重置重連次數
            this.onOpen?.(event);
        };

        this.ws.onmessage = (event) => {
            let data: Commands.BasePayload;
            try {
                data = JSON.parse(event.data as string);
            } catch (e) {
                data = event.data; // 非 JSON 則直接返回原始字串
            }
            this.onMessage?.(data);
        };

        this.ws.onerror = (event) => {
            this.onError?.(event);
        };

        this.ws.onclose = (event) => {
            this.onClose?.(event.code, event.reason);
            this.attemptReconnect();
        };
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`WebSocket 斷開，${this.reconnectInterval}ms 後嘗試第 ${this.reconnectAttempts} 次重連...`);
            setTimeout(() => {
                this.connect();
            }, this.reconnectInterval);
        } else {
            console.log('WebSocket 重連次數已達上限，停止重連');
        }
    }

    send(data: Commands.ClientBasePayload): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket 未連線，無法發送資料');
            return;
        }

        const message = typeof data === 'string' ? data : JSON.stringify(data);
        this.ws.send(message);
    }

    close(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
}