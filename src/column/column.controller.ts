import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ROUTES } from './constants';

@Controller('column')
export class ColumnController {
    constructor(private readonly columnService: ColumnService) { }

    @Post(ROUTES.create)
    async create(@Body() columnData: { name: string, boardId: string }) {
        return await this.columnService.createBoard(columnData);
    }

    @Get('/:columnId')
    async getById(@Param('columnId') columnId: string) {
        return await this.columnService.getColumnById(columnId);
    }

    @Put(ROUTES.update)
    async updateName(@Body() columnData: { name: string, columnId: string }) {
        return await this.columnService.updateColumnName(columnData);
    }

    @Delete(ROUTES.delete)
    async deleteColumn(@Body() { columnId }: { columnId: string }) {
        return await this.columnService.deleteColumn(columnId);
    }
}
