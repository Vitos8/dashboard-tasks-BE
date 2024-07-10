import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ColumnService {
    constructor(private readonly prisma: PrismaService) { }

    async create(columnName:string){
        // return await this.prisma.
    }
}
