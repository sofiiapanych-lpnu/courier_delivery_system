import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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
  async getAllUsers(
    @Query('email') email?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('role') role?: string,
    @Query('addressQuery') addressQuery?: string,
    @Query('vehicleQuery') vehicleQuery?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    items: User[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const query = {
      email,
      phoneNumber,
      firstName,
      lastName,
      role,
      addressQuery,
      vehicleQuery,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    };

    return this.userService.getAllUsers(query);
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
