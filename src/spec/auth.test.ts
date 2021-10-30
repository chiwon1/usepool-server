import request from 'supertest';
import randomstring from 'randomstring';
import app from '../app';

describe('Auth', () => {
  describe('GET /user without token', () => {
    it('status respond with 401', (done) => {
      void request(app)
        .get('/api/user')
        .then((res) => {
          expect(res.status).toBe(401);
          expect(res.body).toStrictEqual({ error: 'Invalid token' });

          done();
        });
    });
  });

  describe('GET /user invalid token', () => {
    const token = randomstring.generate();

    it('status respond with 400', (done) => {
      void request(app)
        .get('/api/user')
        .set('authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toStrictEqual({ error: 'Invalid user' });

          done();
        });
    });
  });
});
