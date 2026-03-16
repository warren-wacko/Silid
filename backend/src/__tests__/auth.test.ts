import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Warren',
        email: 'warren@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('warren@test.com');
      expect(response.body.user.password_hash).toBeUndefined();
    });

    it('should not register with missing fields', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'warren@test.com',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });

    it('should not register duplicate email', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Warren',
        email: 'warren@test.com',
        password: 'password123',
      });

      const response = await request(app).post('/api/auth/register').send({
        name: 'Warren',
        email: 'warren@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already in use');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Warren',
        email: 'warren@test.com',
        password: 'password123',
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'warren@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should not login with wrong password', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Warren',
        email: 'warren@test.com',
        password: 'password123',
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'warren@test.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
