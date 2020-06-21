export type LoggerOptions = {
  guildLog: string,
  msgLog: string,
  modLog: string,
  userLog: string,
  
}

export enum memberUpdateType {
  NONE,
  ADDEDROLE,
  REMOVEDROLE,
  USERNAME,
  NICKNAME
}