import { FieldPacket, ResultSetHeader, RowDataPacket } from 'mysql2';

export type ExecuteResult = 
  | [RowDataPacket[] | ResultSetHeader, FieldPacket[]]
  | [RowDataPacket[][], FieldPacket[]]
  | [FieldPacket[]];