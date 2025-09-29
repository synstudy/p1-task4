import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  AdminDashboardStats,
  GetAdminDashboardStatsUseCase,
} from '../../application/use-cases/dashboard/get-admin-dashboard-stats.usecase';
import {
  GetUserDashboardStatsUseCase,
  UserDashboardStats,
} from '../../application/use-cases/dashboard/get-user-dashboard-stats.usecase';
import { Roles } from '../decorators/roles.decorator';
import { User as UserDecorator } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Controller('dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(
    private readonly getAdminDashboardStatsUseCase: GetAdminDashboardStatsUseCase,
    private readonly getUserDashboardStatsUseCase: GetUserDashboardStatsUseCase,
  ) {}

  @Get('admin')
  @Roles('ADMIN')
  async getAdminDashboardStats(): Promise<AdminDashboardStats> {
    return this.getAdminDashboardStatsUseCase.execute();
  }

  @Get('user')
  @Roles('ADMIN', 'USER')
  getUserDashboardStats(
    @UserDecorator() user: { sub: string; role: string },
  ): Promise<UserDashboardStats> {
    return this.getUserDashboardStatsUseCase.execute(user.sub);
  }
}
