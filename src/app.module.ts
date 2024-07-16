import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { ColumnModule } from './column/column.module';
import { TaskModule } from './task/task.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    BoardModule,
    ColumnModule,
    TaskModule
  ],
  controllers: [AppController],  
  providers: [AppService],
})
export class AppModule { }
