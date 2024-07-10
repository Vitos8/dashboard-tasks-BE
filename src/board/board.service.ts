import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BoardService {
    constructor(private readonly prisma: PrismaService) { }

    async createBoard(boardDto: { userId: string; boardName: string; boardDescription: string }) {
        try {
            const board = await this.prisma.board.create({
                data: {
                    boardName: boardDto.boardName,
                    description: boardDto.boardDescription,
                    userId: boardDto.userId,
                },
            });
            return board;
        } catch (error) {
            console.error('Error creating board:', error);
            throw new HttpException('Could not create board', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllBoards(userId: string) {
        return this.prisma.board.findMany({
            where: {
                userId,
            }
        })
    }
    async deleteBoardById(boardId: string) {
        return await this.prisma.board.delete({
            where: {
                id: boardId,
            },
        })
    }

    async getBoardById(boardId: string) {
        return this.prisma.board.findUnique({
            where: {
                id: boardId
            }
        })
    }

    async updateBoardName(boardId: string, boardName: string) {
        return await this.prisma.board.update({
            where: {
                id: boardId
            },
            data: {
                boardName: boardName
            }
        })
    }

}
