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
            //Creating base column
            await this.prisma.column.create({
                data: {
                    boardId: board.id,
                    name: "To Do"
                }
            })

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
        return await this.prisma.$transaction(async (prisma) => {
            // Delete all tasks associated with the columns of the board
            await prisma.task.deleteMany({
                where: {
                    column: {
                        boardId: boardId,
                    },
                },
            });

            // Delete all columns associated with the board
            await prisma.column.deleteMany({
                where: {
                    boardId: boardId,
                },
            });

            // Delete the board
            return prisma.board.delete({
                where: {
                    id: boardId,
                },
            });
        });
    }

    async getBoardById(boardId: string) {
        return this.prisma.board.findUnique({
            where: {
                id: boardId
            },
            include: {
                columns: {
                    include: {
                        tasks: {
                            orderBy: {
                                position: 'asc', 
                            },
                        },
                    },
                },
            },
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
