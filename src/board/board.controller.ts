import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ROUTES } from './constants';
import { ClerkAuthGuard } from 'src/auth/clerk.auth.guard';
import { CreateBoardDto } from './dto/create-board-dto';
import { BoardService } from './board.service';

@Controller('board')
export class BoardController {
    constructor(private readonly boardService: BoardService) { }

    @Get(ROUTES.ALL)
    async getAll(@Query('userId') userId: string,) {
        return await this.boardService.getAllBoards(userId)
    }

    @Post(ROUTES.CREATE)
    async create(@Body() CreateBoardDto: CreateBoardDto) {
        return await this.boardService.createBoard(CreateBoardDto);
    }

    @Get('/:id')
    async getById(@Param('id') id: string,) {
        return await this.boardService.getBoardById(id)
    }

    @Delete('/:id')
    async deleteById(@Param('id') id: string,) {
        return await this.boardService.deleteBoardById(id)
    }

    @Put('/:id')
    async updateName(@Param('id') id: string, @Body() { name }: { name: string }) {
        return await this.boardService.updateBoardName(id, name);
    }

}
