// NetworkManager.ts
import { director, _decorator, Component, Node, game } from 'cc';
const { ccclass, property } = _decorator;
import { WebSocketClient } from './WebSocketClient';
import { EventGo } from './EventGo';
import * as Commands from './Command/commands';
@ccclass('NetworkManager')
export class NetworkManager extends Component {

    private static _instance: NetworkManager;
    private wsClient: WebSocketClient = null;
    public static get instance() {
        return this._instance;
    }

    private _ws: WebSocket | null = null;
    private player : Commands.PlayerData;

    public setPlayer(player : Commands.PlayerData)
    {
        this.player = player;
    }
    public getPlayer()
    {
        return this.player;
    }
    onLoad() {
        // 确保只有一个实例
        if (NetworkManager._instance) {
            this.node.destroy();
            return;
        }
        NetworkManager._instance = this;

        // 设置为常驻节点（只在第一个场景调用！）
        director.addPersistRootNode(this.node);

        this.startWebsocket();
        EventGo.on("client-message", (data : Commands.BasePayload) => {
            this.wsClient.send(data)
        })
    }
    public startWebsocket() {
        // 建立實例
        this.wsClient = new WebSocketClient('ws://127.0.0.1:8080/ws');

        // 設定回調
        this.wsClient.onOpen = () => {
            console.log('連線成功！');
            //wsClient.send({ cmd: 'login', playerId: 1001 });
        };

        this.wsClient.onMessage = (data) => {
            console.log('收到伺服器訊息:', data);
            const basePayload = JSON.parse(data) as Commands.BasePayload;
            let eventName = "game"
            if (basePayload.commandSubAction == 1) {
                eventName = "room"
            }
            EventGo.emit("server-message-" + eventName, data)
            // 處理你的遊戲協議
        };

        this.wsClient.onError = (err) => {
            console.error('WebSocket 錯誤:', err);
        };

        this.wsClient.onClose = (code, reason) => {
            console.log(`連線關閉: ${code} - ${reason}`);
        };

        // 發起連線
        this.wsClient.connect();

    }

    onDestroy() {
        // 常驻节点一般不会销毁，但为了安全可以处理
        if (this._ws) {
            this._ws.close();
        }
    }
}

