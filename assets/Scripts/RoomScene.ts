import { Label, log, _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;
import * as Commands from "./Command/commands";
import { EventGo } from "./EventGo"
import { WaitSeatCom } from './WaitSeatCom';
import { NetworkManager } from './NetworkManager';
@ccclass('RoomScene')
export class RoomScene extends Component {
    @property(Node)
    waitSeatA: Node = null!;
    @property(Node)
    waitSeatB: Node = null!;
    @property(Node)
    waitSeatC: Node = null!;
    @property(Node)
    waitSeatD: Node = null!;
    @property(Node)
    roomName: Node = null!;

    private waitSeatMap = new Map<string, WaitSeatCom>();
    private playerSeatMap = new Map<number, string>();

    private playerID: number;
    private identifier: string = "";
    private roomID: number;
    private params: URLSearchParams = null;
    private players: Commands.PlayerData[];
    onLoad() {
        this.params = this.getQueryParams();
        //this.identifier = this.params.get("user");
        //this.roomID = parseInt(this.params.get("room"));
        this.identifier = "user-1"
        this.roomID = 1

        const roomNameLabel = this.roomName.getComponent(Label)
        roomNameLabel.string = "Room No [" + this.roomID + "]"
        log("RoomScene.onLoad.1")
        const waitSeatComA = this.waitSeatA.getComponent(WaitSeatCom)
        const waitSeatComB = this.waitSeatB.getComponent(WaitSeatCom)
        const waitSeatComC = this.waitSeatC.getComponent(WaitSeatCom)
        const waitSeatComD = this.waitSeatD.getComponent(WaitSeatCom)
        this.waitSeatMap.set("A", waitSeatComA)
        this.waitSeatMap.set("B", waitSeatComB)
        this.waitSeatMap.set("C", waitSeatComC)
        this.waitSeatMap.set("D", waitSeatComD)

        this.playerSeatMap.set(1, "A")
        this.playerSeatMap.set(2, "B")
        this.playerSeatMap.set(3, "C")
        this.playerSeatMap.set(4, "D")
    }
    getQueryParams(): URLSearchParams {
        // 获取 ? 后面的部分，例如 "?userId=123&lang=zh"
        const search = window.location.search;
        return new URLSearchParams(search);
    }
    start() {
        EventGo.on("server-message-room", (data: Commands.BasePayload) => {
            log("server-message-room", data)
            this.onAction(data)
        })
        this.doEnter()
    }

    onAction(basePayload: Commands.BasePayload) {
        switch (basePayload.commandAction) {
            case Commands.CommandAction.OnCmdServerRoomInfo:
                const payload = JSON.parse(basePayload.data) as Commands.CmdServerRoomInfo;
                this.players = payload.players
                this.updateRoom()
                break;
            case Commands.CommandAction.OnCmdServerToStart:
                const player = this.players.filter(f => f.identifier == this.identifier)
                NetworkManager.instance.setPlayer(player[0])
                director.loadScene("GameScene")
                break;
            case Commands.CommandAction.OnCmdServerEnterFail:
                this.onLeave()
                break;

        }
    }

    onLeave() {
        window.location.replace('/game-exit.html');

    }

    doEnter() {
        const payload: Commands.CmdClientEnterRoom = {
            identifier: this.identifier,
            roomID: this.roomID
        }
        const basePayload: Commands.BasePayload = {
            commandAction: Commands.CommandAction.OnCmdClientEnterRoom,
            commandSubAction: 1,
            data: JSON.stringify(payload),
            target: ""
        }
        EventGo.emit("client-message", basePayload)


    }

    updateRoom() {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            const seat = this.playerSeatMap.get(player.playerID)
            const com = this.waitSeatMap.get(seat)
            com.setPlayer(this.playerID == player.playerID, this.roomID, player)
        }
    }

    update(deltaTime: number) {

    }
}

