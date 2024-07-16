import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { ROUTES } from './constants';
import { Epic, Priority } from '@prisma/client';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Post(ROUTES.create)
    async create(@Body() taskData: { name: string, columnId: string }) {
        return await this.taskService.createTask(taskData);
    }

    @Put(ROUTES.move)
    async move(@Body() { taskId, newColumnId, destinationIndex }:
        { taskId: string, newColumnId: string, destinationIndex: number }) {
        return await this.taskService.updateTaskPosition(taskId, newColumnId, destinationIndex);
    }

    @Delete(ROUTES.delete)
    async delete(@Body() taskData: { taskId: string }) {
        return this.taskService.deleteTask(taskData.taskId)
    }

    @Put(ROUTES.update)
    async update(@Body() taskData: {
        taskId: string,
        name: string,
        priority: Priority,
        epic: Epic,
        taskDescription: string,
        assigneeId: string,
    }) {
        return this.taskService.updateTask(taskData)
    }

    @Get('/:taskId')
    async getById(@Param() { taskId }: { taskId: string }) {
        return this.taskService.getTaskById(taskId)
    }
}

