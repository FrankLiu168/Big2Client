
enum CommandAction {
  InAIPayloadRequest = 101,
  InAIPayloadResponse = 102,

  OnCmdServerCurrentPlayer = 201,
  OnCmdServerDealCards = 202,
  OnCmdServerPlayerAction = 203,
  OnCmdServerGameOver = 204,
  OnCmdServerNewRound = 205,

  OnCmdClientPlayerAction = 301,

  OnCmdServerRoomInfo = 401,
  OnCmdServerToStart = 402,
  OnCmdServerEnterFail = 403,

  OnCmdClientEnterRoom = 501,
  OnCmdClientReady = 502,
  OnCmdClientCancel = 503
}

interface PlayerData {
  identifier : string;
  playerID: number;
  playerName : string;
  isReady: boolean;

}

interface BasePayload {
  commandAction: CommandAction;   // json: "command"
  commandSubAction : number;
  target: string;           // json: "target"
  data: string;             // json: "data"
}

interface CmdClientReady {
  roomID: number;
  playerID: number;         // json: "playerID"

}

interface CmdClientCancel {
  roomID : number;
  playerID: number;         // json: "playerID"

}

interface CmdClientEnterRoom {
  identifier: string;
  roomID : number;
}

interface CmdServerRoomInfo {
  players: PlayerData[]
}

interface CmdServerToStart {
  gameID: string
}

interface CmdServerEnterFail {
  failID : number
}





interface CmdServerNewRound {
  roundID: number;          // json: "roundID"
  takeTime: number;         // json: "takeTime"
}




interface CmdServerDealCards {
  cards: number[];          // json: "cards"
  takeTime: number;         // json: "takeTime"
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

interface CmdServerPlayerAction {
  playerID: number;         // json: "playerID"
  isPass: boolean;          // json: "isPass"
  cardType: number;       // json: "cardType"
  cards: number[];          // json: "cards"
  takeTime: number;         // json: "takeTime"
}

interface CmdServerGameOver {
  status: { [playerID: number]: number }; // json: "status" (map[int]int)
  takeTime: number;                       // json: "takeTime"
}

export { CommandAction }; 

export type {
  PlayerData,

  BasePayload,

  CmdClientEnterRoom,
  CmdClientCancel,
  CmdClientReady,

  CmdServerEnterFail,
  CmdServerRoomInfo,
  CmdServerToStart,

  CmdServerNewRound,
  CmdServerDealCards,
  CmdServerCurrentPlayer,
  CmdClientPlayerAction,
  CmdServerPlayerAction,
  CmdServerGameOver,
};
