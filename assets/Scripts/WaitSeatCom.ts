import { _decorator, Component, Node,Button,Label } from 'cc';
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

    public setPlayer(isSelf : boolean,roomID : number,player : Commands.PlayerData)
    {
        this.player = player
        const readyBtn = this.readyButton.getComponent(Button)
        const cancelBtn = this.cancelButton.getComponent(Button)
        const nameLabel = this.nameNode.getComponent(Label)
        const statusLabel = this.statusNode.getComponent(Label)
        readyBtn.enabled = false
        cancelBtn.enabled = false
        if(isSelf){
            if(player.isReady) {
                cancelBtn.enabled = true
            } else {
                readyBtn.enabled = true
            }
        }
        nameLabel.string = player.playerName
        statusLabel.string = player.isReady ? "已準備" : "等待中"
    }

    onClickRead() {
        const payload : Commands.CmdClientReady = {
            roomID : this.roomID,
            playerID : this.player.playerID
        }
        const basePayload : Commands.BasePayload = {
            commandAction: Commands.CommandAction.OnCmdClientReady,
            commandSubAction: 1,
            data: JSON.stringify(payload),
            target: ""
        }
        EventGo.emit("server-message-room",basePayload)
    }
    onClickCancel() {   
        const payload : Commands.CmdClientCancel = {
            roomID : this.roomID,
            playerID : this.player.playerID
        }
        const basePayload : Commands.BasePayload = {
            commandAction: Commands.CommandAction.OnCmdClientCancel,
            commandSubAction: 1,
            data: JSON.stringify(payload),
            target: ""
        }
        EventGo.emit("server-message-room",basePayload)
    }


    start() {

    }

    update(deltaTime: number) {
        
    }
}

