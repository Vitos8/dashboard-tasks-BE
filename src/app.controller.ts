import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getUsers() {
    return this.appService.getUsers();
  }

  @Get('/products')
  getProducts() {
    return [
      {
        name: 'Prima',
        id: '12321-prima',
        price: '2$'
      },
      {
        name: 'Ratmans',
        id: '123221-ratmans',
        price: '4$'
      },
      {
        name: 'Chapman',
        id: '12321-chapman',
        price: '6$'
      }
    ]
  }
}
