import { Body, Delete, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ROUTES } from './constants';
import { Epic, Priority } from '@prisma/client';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) { }

    async createTask({ name, columnId }: { name: string, columnId: string }) {
        const maxPosition = await this.prisma.task.findFirst({
            where: { columnId },
            orderBy: { position: 'desc' },
            select: { position: true },
        });

        const newPosition = maxPosition ? maxPosition.position + 1 : 0;

        return await this.prisma.task.create({
            data: {
                name,
                columnId,
                position: newPosition
            }
        })
    }

    async deleteTask(taskId: string) {
        return await this.prisma.task.delete({
            where: {
                id: taskId
            }
        })
    }

    async getTaskById(taskId: string) {
        return await this.prisma.task.findUnique({
            where: {
                id: taskId
            }
        })
    }


    async updateTask(taskData: {
        taskId: string,
        priority: Priority,
        epic: Epic,
        name: string,
        taskDescription: string,
        assigneeId: string,
    }) {
        const updateData: { [key: string]: any } = {};

        if (taskData.priority !== undefined) {
            updateData.priority = taskData.priority;
        }

        if (taskData.epic !== undefined) {
            updateData.epic = taskData.epic;
        }

        if (taskData.taskDescription !== undefined) {
            updateData.description = taskData.taskDescription;
        }

        if (taskData.name !== undefined) {
            updateData.name = taskData.name;
        }

        if (taskData.assigneeId !== undefined) {
            updateData.assigneeId = taskData.assigneeId;
        }

        return this.prisma.task.update({
            where: {
                id: taskData.taskId
            },
            data: updateData,
        });
    }


    async updateTaskPosition(taskId: string, newColumnId: string, newIndex: number) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            throw new Error('Task not found');
        }

        if (task.columnId === newColumnId) {
            // Moving within the same column
            if (task.position !== newIndex) {
                await this.prisma.$transaction(async (prisma) => {
                    // Adjust positions of tasks in the same column
                    if (task.position < newIndex) {
                        await prisma.task.updateMany({
                            where: {
                                columnId: newColumnId,
                                position: { gt: task.position, lte: newIndex },
                            },
                            data: {
                                position: {
                                    decrement: 1,
                                },
                            },
                        });
                    } else {
                        await prisma.task.updateMany({
                            where: {
                                columnId: newColumnId,
                                position: { gte: newIndex, lt: task.position },
                            },
                            data: {
                                position: {
                                    increment: 1,
                                },
                            },
                        });
                    }

                    // Update the position of the moved task
                    await prisma.task.update({
                        where: { id: taskId },
                        data: {
                            position: newIndex,
                        },
                    });
                });
            }
        } else {
            // Moving to a different column
            await this.prisma.$transaction(async (prisma) => {
                // Adjust positions of tasks in the source column
                await prisma.task.updateMany({
                    where: {
                        columnId: task.columnId,
                        position: { gt: task.position },
                    },
                    data: {
                        position: {
                            decrement: 1,
                        },
                    },
                });

                // Adjust positions of tasks in the destination column
                await prisma.task.updateMany({
                    where: {
                        columnId: newColumnId,
                        position: { gte: newIndex },
                    },
                    data: {
                        position: {
                            increment: 1,
                        },
                    },
                });

                // Update the column and position of the moved task
                await prisma.task.update({
                    where: { id: taskId },
                    data: {
                        columnId: newColumnId,
                        position: newIndex,
                    },
                });
            });
        }
    }
}
