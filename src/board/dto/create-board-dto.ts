import { IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  userId: string

  @IsString()
  boardName:string

  @IsString()
  boardDescription:string 
}