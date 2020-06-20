export type LoggerOptions = {
  userLog: string,
  msgLog: string,
  modLog: string
}

export enum memberUpdateType {
  NONE,
  ADDEDROLE,
  REMOVEDROLE,
  USERNAME,
  NICKNAME
}