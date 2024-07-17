import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }

    async createUserToDb(userId: string) {
        try {
            const clerkUser = await clerkClient.users.getUser(userId);
            if (!clerkUser) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            // Check if user already exists to avoid transactional operation
            const existingUser = await this.prisma.user.findUnique({
                where: { id: clerkUser.id },
            });

            if (existingUser) {
                return existingUser;
            }

            const user = await this.prisma.user.create({
                data: {
                    id: clerkUser.id,
                    name: clerkUser.firstName,
                    email: clerkUser.emailAddresses[0].emailAddress,
                },
            });
            return clerkUser;
        } catch (error) {
            console.error('Error creating user:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new Error('Could not create user');
        }
    }
}
