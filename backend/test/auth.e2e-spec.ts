import { app, prisma, request } from './setup.e2e';
import { HttpStatus } from '@nestjs/common';

describe('User Registration and Login (e2e)', () => {
  beforeEach(async () => {
    // Clean the database before each test in the correct order to respect foreign key constraints
    await prisma.comment.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.projectMember.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it('/users/register (POST) - should register a new user successfully', async () => {
    const registerData = {
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send(registerData)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(registerData.email);
    expect(response.body.firstName).toBe(registerData.firstName);
    expect(response.body.lastName).toBe(registerData.lastName);
    expect(response.body.role).toBe('USER');
    expect(response.body).not.toHaveProperty('password');
  });

  it('/users/register (POST) - should return error when email already exists', async () => {
    const registerData = {
      email: 'existing@example.com',
      password: 'password123',
      firstName: 'Existing',
      lastName: 'User',
    };

    // First registration should succeed
    await request(app.getHttpServer())
      .post('/users/register')
      .send(registerData)
      .expect(HttpStatus.CREATED);

    // Second registration with same email should fail
    await request(app.getHttpServer())
      .post('/users/register')
      .send(registerData)
      .expect(409); // Conflict status code when user already exists
  });

  it('/users/login (POST) - should login with valid credentials', async () => {
    const userData = {
      email: 'login@example.com',
      password: 'password123',
      firstName: 'Login',
      lastName: 'User',
    };

    // First register the user
    await request(app.getHttpServer())
      .post('/users/register')
      .send(userData)
      .expect(HttpStatus.CREATED);

    // Then try to login
    const loginData = {
      email: userData.email,
      password: userData.password,
    };

    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send(loginData)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.firstName).toBe(userData.firstName);
    expect(response.body.user.lastName).toBe(userData.lastName);
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('/users/login (POST) - should return error with invalid credentials', async () => {
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'wrongpassword',
    };

    await request(app.getHttpServer())
      .post('/users/login')
      .send(loginData)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('/users/login (POST) - should return error with wrong password', async () => {
    const userData = {
      email: 'wrongpass@example.com',
      password: 'correctpassword',
      firstName: 'Wrong',
      lastName: 'Password',
    };

    // Register user first
    await request(app.getHttpServer())
      .post('/users/register')
      .send(userData)
      .expect(HttpStatus.CREATED);

    // Try to login with wrong password
    const loginData = {
      email: userData.email,
      password: 'wrongpassword',
    };

    await request(app.getHttpServer())
      .post('/users/login')
      .send(loginData)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});