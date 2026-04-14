
enum CommandAction {
  InAIPayloadRequest = 101,
  InAIPayloadResponse = 102,

  OnCmdServerCurrentPlayer = 201,
  OnCmdServerDealCards = 202,
  OnCmdServerPlayerAction = 203,
  OnCmdServerGameOver = 204,
  OnCmdServerNewRound = 205,

  OnCmdClientPlayerAction = 301,
  OnCmdClientReady = 302,
}


interface BasePayload {
  commandAction: CommandAction;   // json: "command"
  target: string;           // json: "target"
  data: string;             // json: "data"
}



interface CmdServerNewRound {
  roundID: number;          // json: "roundID"
  takeTime: number;         // json: "takeTime"
}

interface CmdClientReady {
  playerID: number;         // json: "playerID"
  replyID: string;          // json: "replyID"
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
  BasePayload,
  CmdServerNewRound,
  CmdClientReady,
  CmdServerDealCards,
  CmdServerCurrentPlayer,
  CmdClientPlayerAction,
  CmdServerPlayerAction,
  CmdServerGameOver,
};
