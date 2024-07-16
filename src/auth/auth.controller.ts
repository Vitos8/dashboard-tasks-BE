import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ROUTES } from './constants';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    @Post(ROUTES.CREATE)
    create(@Body() { userId }) {
        return this.authService.createUserToDb(userId);
    }
}
