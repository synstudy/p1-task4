import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { AdminUpdateUserDto } from '../../application/dto/admin-update-user.dto';
import { AuthService } from '../../application/services/auth.service';
import { CreateUserUseCase } from '../../application/use-cases/user/create-user.usecase';
import { GetAllUsersUseCase } from '../../application/use-cases/user/get-all-users.usecase';
import { GetUserUseCase } from '../../application/use-cases/user/get-user.usecase';
import { AdminUpdateUserUseCase } from '../../application/use-cases/user/admin-update-user.usecase';
import { SelfUpdateUserUseCase } from '../../application/use-cases/user/self-update-user.usecase';
import { UpdateUserRoleUseCase } from '../../application/use-cases/user/update-user-role.usecase';
import { Roles } from '../decorators/roles.decorator';
import { JwtPayload, User } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly adminUpdateUserUseCase: AdminUpdateUserUseCase,
    private readonly selfUpdateUserUseCase: SelfUpdateUserUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@User() user: JwtPayload) {
    // Get the user ID from the authenticated user in the request
    const userId = user.sub; // 'sub' is the standard JWT claim for subject (user ID)
    return await this.getUserUseCase.execute(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  getUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.getUserUseCase.execute(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get()
  getAllUsers() {
    return this.getAllUsersUseCase.execute();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async adminUpdateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: AdminUpdateUserDto,
  ) {
    return await this.adminUpdateUserUseCase.execute(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Put('me')
  async selfUpdateUser(@User() user: JwtPayload, @Body() updateUserDto: UpdateUserDto) {
    return await this.selfUpdateUserUseCase.execute(user.sub, updateUserDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/role')
  async updateUserRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('role') role: 'ADMIN' | 'USER',
  ) {
    return await this.updateUserRoleUseCase.execute(id, { role });
  }
}
