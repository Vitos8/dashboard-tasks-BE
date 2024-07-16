import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ColumnService {
    constructor(private readonly prisma: PrismaService) { }

    async createBoard({ name, boardId }: { name: string, boardId: string }) {
        return await this.prisma.column.create({
            data: {
                name: name,
                boardId: boardId,
            }
        })
    }

    async getColumnById(columnId: string) {
        return await this.prisma.column.findUnique({
            where: {
                id: columnId
            }
        })
    }


    async updateColumnName({ name, columnId }: { name: string, columnId: string }) {
        return await this.prisma.column.update({
            where: {
                id: columnId
            },
            data: {
                name
            }
        })
    }

    async deleteColumn(columnId: string) {

        const column = await this.prisma.column.findUnique({
            where: {
                id: columnId,
            },
        });

        if (!column) {
            throw new NotFoundException(`Column with ID ${columnId} not found`);
        }

        return this.prisma.$transaction(async (prisma) => {
            // Delete all tasks associated with the column
            await prisma.task.deleteMany({
                where: {
                    columnId: columnId,
                },
            });

            // Delete the column
            return prisma.column.delete({
                where: {
                    id: columnId,
                },
            });
        });
    }
}
