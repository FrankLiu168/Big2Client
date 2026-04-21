
enum CommandAction {
  InAIPayloadRequest = 101,
  InAIPayloadResponse = 102,

  OnCmdServerCurrentPlayer = 201,
  OnCmdServerDealCards = 202,
  OnCmdServerPlayerAction = 203,
  OnCmdServerGameOver = 204,
  OnCmdServerNewRound = 205,

  OnCmdClientPlayerAction = 301,
  OnCmdClientOnGame = 302,

  OnCmdServerRoomInfo = 401,
  OnCmdServerToStart = 402,
  OnCmdServerEnterFail = 403,

  OnCmdClientEnterRoom = 501,
  OnCmdClientReady = 502,
  OnCmdClientCancel = 503,
  OnCmdClientLeaveRoom = 504
}

interface PlayerData {
  identifier: string;
  playerID: number;
  playerName: string;
  isReady: boolean;

}

interface ConnectorPayload {
  identifier: string
  data: ClientBasePayload
}

interface ClientBasePayload {
  commandAction: CommandAction
  data: string
  roomID: number
  gameID: string
}

interface BasePayload {
  commandAction: CommandAction;  
  commandSubAction: number;
  target: string;           
  data: string;            
}

interface CmdClientReady {    

}

interface CmdClientCancel {      

}

interface CmdClientEnterRoom {
}

interface CmdClientLeaveRoom {
     
}

interface CmdServerRoomInfo {
  players: PlayerData[]
}

interface CmdServerToStart {
  gameID: string
}

interface CmdServerEnterFail {
  failID: number
}





interface CmdServerNewRound {
  roundID: number;          // json: "roundID"
  takeTime: number;         // json: "takeTime"
}




interface CmdServerDealCards {
  cards: number[];          // json: "cards"
  takeTime: number;         // json: "takeTime"
  players : PlayerData[]
}

interface CmdServerCurrentPlayer {
  replyID: string;          // json: "replyID"
  playerID: number;         // json: "playerID"
  takeTime: number;         // json: "takeTime"
}

interface CmdClientPlayerAction {
  replyID: string;          // json: "replyID"
  playerID: number;         // json: "playerID"
  isPass: boolean;          // json: "isPass"
  cardType: number;       // json: "cardType"
  cards: number[];          // json: "cards"
  reason: string;           // json: "reason"
}

interface CmdClientOnGame {

}

interface CmdServerPlayerAction {
  playerID: number;         // json: "playerID"
  isPass: boolean;          // json: "isPass"
  cardType: number;       // json: "cardType"
  cards: number[];          // json: "cards"
  takeTime: number;         // json: "takeTime"
}

interface CmdServerGameOver {
  status: Record<string, number>;
  takeTime: number;
}

export { CommandAction };

export type {
  PlayerData,

  ConnectorPayload,
  ClientBasePayload,
  BasePayload,

  CmdClientEnterRoom,
  CmdClientCancel,
  CmdClientReady,
  CmdClientLeaveRoom,

  CmdServerEnterFail,
  CmdServerRoomInfo,
  CmdServerToStart,

  CmdServerNewRound,
  CmdServerDealCards,
  CmdServerCurrentPlayer,
  CmdServerPlayerAction,
  CmdServerGameOver,

  CmdClientPlayerAction, 
  CmdClientOnGame,
};
