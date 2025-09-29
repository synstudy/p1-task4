import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestAppModule } from './test-app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';
import request from 'supertest';

let app: INestApplication;
let prisma: PrismaService;

beforeAll(async () => {
  // Create testing module with test-specific app module
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [TestAppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  prisma = moduleFixture.get<PrismaService>(PrismaService);
  
  // Connect to the database after app initialization
  await app.init();
});

afterAll(async () => {
  await app.close();
});

export { app, prisma, request };