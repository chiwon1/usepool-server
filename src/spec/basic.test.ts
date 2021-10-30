import request from 'supertest';
import randomstring from 'randomstring';
import app from '../app';

describe('GET /', () => {
  it('should respond with 200', (done) => {
    void request(app)
      .get('/')
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({ result: 'success' });

        done();
      });
  });
});

describe('GET `/not-valid-url', () => {
  it('should respond with 404', (done) => {
    const randomString = randomstring.generate();

    void request(app)
      .get(`/${randomString}`)
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body).toStrictEqual({ error: 'Invalid URL' });

        done();
      });
  });
});
