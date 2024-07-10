import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { ColumnModule } from './column/column.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    BoardModule,
    ColumnModule
  ],
  controllers: [AppController],  
  providers: [AppService],
})
export class AppModule { }
