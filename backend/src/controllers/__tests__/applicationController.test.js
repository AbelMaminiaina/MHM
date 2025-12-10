import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import connectDB from '../../config/db.js';
import Member from '../../models/Member.js';
import User from '../../models/User.js';

describe('Application Controller', () => {
  let authToken;

  beforeAll(async () => {
    // Connect to test database
    process.env.MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/HFM_test';
    await connectDB();

    // Create test user and get auth token
    await User.deleteMany({});
    await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'Test123',
    });

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({ email: 'admin@test.com', password: 'Test123' });

    authToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    // Clean up and close connection
    await Member.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear members before each test
    await Member.deleteMany({});
  });

  describe('POST /api/applications', () => {
    test('should submit a new membership application', async () => {
      const applicationData = {
        firstName: 'Jean',
        lastName: 'Rakoto',
        dateOfBirth: '1990-05-15',
        address: {
          street: '12 Rue de la Paix',
          city: 'Antananarivo',
          postalCode: '101',
          country: 'Madagascar',
        },
        phone: '+261341234567',
        email: 'jean.rakoto@email.com',
        memberType: 'regular',
        emergencyContact: {
          name: 'Marie Rakoto',
          phone: '+261347654321',
          relationship: 'Épouse',
        },
        occupation: 'Ingénieur',
        interests: 'Sport, lecture',
      };

      const response = await request(app)
        .post('/api/applications')
        .send(applicationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('Jean Rakoto');
      expect(response.body.data.email).toBe('jean.rakoto@email.com');
      expect(response.body.data.status).toBe('pending');
    });

    test('should not allow duplicate email', async () => {
      // First application
      await Member.create({
        firstName: 'Jean',
        lastName: 'Rakoto',
        dateOfBirth: '1990-05-15',
        address: { city: 'Antananarivo', postalCode: '101' },
        phone: '+261341234567',
        email: 'jean.rakoto@email.com',
        emergencyContact: {
          name: 'Marie',
          phone: '+261347654321',
          relationship: 'Épouse',
        },
      });

      // Try to create second with same email
      const response = await request(app)
        .post('/api/applications')
        .send({
          firstName: 'Paul',
          lastName: 'Rasolofo',
          dateOfBirth: '1992-03-20',
          address: { city: 'Antananarivo', postalCode: '101' },
          phone: '+261341111111',
          email: 'jean.rakoto@email.com',
          emergencyContact: {
            name: 'Sophie',
            phone: '+261342222222',
            relationship: 'Sœur',
          },
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email existe déjà');
    });

    test('should require all mandatory fields', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({
          firstName: 'Jean',
          // Missing required fields
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/applications/stats', () => {
    test('should return application statistics', async () => {
      // Create test members with different statuses
      await Member.create([
        {
          firstName: 'Jean',
          lastName: 'Rakoto',
          dateOfBirth: '1990-05-15',
          address: { city: 'Antananarivo', postalCode: '101' },
          phone: '+261341234567',
          email: 'jean@email.com',
          status: 'pending',
          memberType: 'regular',
          emergencyContact: { name: 'Marie', phone: '+261347654321', relationship: 'Épouse' },
        },
        {
          firstName: 'Paul',
          lastName: 'Rasolofo',
          dateOfBirth: '1992-03-20',
          address: { city: 'Antananarivo', postalCode: '101' },
          phone: '+261341111111',
          email: 'paul@email.com',
          status: 'active',
          memberType: 'student',
          emergencyContact: { name: 'Sophie', phone: '+261342222222', relationship: 'Sœur' },
        },
      ]);

      const response = await request(app)
        .get('/api/applications/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.byStatus).toBeDefined();
      expect(response.body.data.byStatus.pending).toBeGreaterThanOrEqual(1);
      expect(response.body.data.byStatus.active).toBeGreaterThanOrEqual(1);
      expect(response.body.data.total).toBeGreaterThanOrEqual(2);
    });
  });
});
