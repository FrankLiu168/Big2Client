
import { WebSocketClient } from './WebSocketClient';
import { EventGo } from './EventGo';
import * as Commands from './Command/commands';

export class NetworkManager {

    private static _instance: NetworkManager;

    public static get instance() {
        if (!NetworkManager._instance) {
            NetworkManager._instance = new NetworkManager();
        }
        return NetworkManager._instance;
    }
    private wsClient: WebSocketClient;
    private player: Commands.PlayerData;
    private roomID: number;
    private gameID: string;

    public setPlayer(player: Commands.PlayerData) {
        NetworkManager._instance.player = player;
    }
    public getPlayer() {
        return NetworkManager._instance.player;
    }
    public setRoomID(roomID: number) {
        NetworkManager._instance.roomID = roomID;
    }
    public getRoomID() {
        return NetworkManager._instance.roomID;
    }
    public setGameID(gameID: string) {
        NetworkManager._instance.gameID = gameID;
    }
    public getGameID() {
        return NetworkManager._instance.gameID;
    }
    static Init() {
        if (NetworkManager._instance) {
            return;
        }
        NetworkManager._instance = new NetworkManager();

        NetworkManager._instance.startWebsocket();
        EventGo.on("client-message", (data: Commands.ClientBasePayload) => {
            NetworkManager._instance.wsClient.send(data)
        })
    }

    public startWebsocket() {
        // 建立實例
        NetworkManager._instance.wsClient = new WebSocketClient('ws://127.0.0.1:8080/ws');

        // 設定回調
        NetworkManager._instance.wsClient.onOpen = () => {
            console.log('連線成功！');
            //wsClient.send({ cmd: 'login', playerId: 1001 });
        };

        NetworkManager._instance.wsClient.onMessage = (data) => {
            console.log('收到伺服器訊息:', data);
            const basePayload = data as Commands.BasePayload;
            let eventName = "game"
            if (basePayload.commandSubAction == 1) {
                eventName = "room"
            }
            //console.log("server-message-" + eventName)
            EventGo.emit("server-message-" + eventName, data)
            // 處理你的遊戲協議
        };

        NetworkManager._instance.wsClient.onError = (err) => {
            console.error('WebSocket 錯誤:', err);
        };

        NetworkManager._instance.wsClient.onClose = (code, reason) => {
            console.log(`連線關閉: ${code} - ${reason}`);
        };

        // 發起連線
        this.wsClient.connect();

    }

}

