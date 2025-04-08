import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: number): Promise<User> {
    return this.userService.getUserById(userId);
  }

  @Put(':userId')
  async updateUser(
    @Param('userId') userId: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(userId, dto);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: number): Promise<{ message: string }> {
    return this.userService.deleteUser(userId);
  }
}
