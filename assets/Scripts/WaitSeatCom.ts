import { log,_decorator, Component, Node,Button,Label } from 'cc';
const { ccclass, property } = _decorator;
import * as Commands from './Command/commands';
import { EventGo } from './EventGo';
@ccclass('WaitSeatCom')
export class WaitSeatCom extends Component {
    @property(Node)
    avatar :  Node = null!;
    @property(Node)
    readyButton : Node = null!;
    @property(Node)
    cancelButton : Node = null!;
    @property(Node)
    nameNode : Node = null!;
    @property(Node)
    statusNode : Node = null!;


    private player : Commands.PlayerData
    private roomID : number
    public setRoomID(roomID : number) {
        this.roomID = roomID;
    }
    public setPlayer(isSelf : boolean,roomID : number,player : Commands.PlayerData)
    {
        this.player = player
        const readyBtn = this.readyButton.getComponent(Button)
        const cancelBtn = this.cancelButton.getComponent(Button)
        const nameLabel = this.nameNode.getComponent(Label)
        const statusLabel = this.statusNode.getComponent(Label)
        readyBtn.interactable = false
        cancelBtn.interactable = false
        if(isSelf){
            if(player.isReady) {
                cancelBtn.interactable = true
            } else {
                readyBtn.interactable = true
            }
        }
        nameLabel.string = player.playerName
        statusLabel.string = player.isReady ? "已準備" : "等待中"
    }

    onClickRead() {
        log("cilck ready")
        const payload : Commands.CmdClientReady = {
            roomID : this.roomID,
            playerID : this.player.playerID
        }
        const basePayload : Commands.ClientBasePayload = {
            commandAction: Commands.CommandAction.OnCmdClientReady,
            data: JSON.stringify(payload),
            roomID : this.roomID,
            gameID: ""
        }
        EventGo.emit("client-message",basePayload)
    }
    onClickCancel() {   
        log("cancel")
        const payload : Commands.CmdClientCancel = {
            roomID : this.roomID,
            playerID : this.player.playerID
        }
        const basePayload : Commands.ClientBasePayload = {
            commandAction: Commands.CommandAction.OnCmdClientCancel,
            data: JSON.stringify(payload),
            roomID : this.roomID,
            gameID: ""
        }
        EventGo.emit("client-message",basePayload)
    }


    start() {
        const readyBtn = this.readyButton.getComponent(Button)
        const cancelBtn = this.cancelButton.getComponent(Button)
        readyBtn.interactable = false
        cancelBtn.interactable = false
    }

    update(deltaTime: number) {
        
    }
}

