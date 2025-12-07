import request from 'supertest';

import { App } from '../src/app';
import { boot } from '../src/main';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Login - success', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'Dina_Kris@gmail.com',
			password: '123456',
		});
		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).not.toBeUndefined();
	});
	it('Login - failed login', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'D_Kris@gmail.com',
			password: '123456',
		});
		expect(res.statusCode).toBe(401);
	});
	it('Login - failed password', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'Dina_Kris@gmail.com',
			password: '654321',
		});
		expect(res.statusCode).toBe(401);
	});
	it('Info - success', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'Dina_Kris@gmail.com',
			password: '123456',
		});
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`)
			.send();
		expect(res.statusCode).toBe(200);
		expect(res.body?.email).toBe('Dina_Kris@gmail.com');
		expect(res.body?.id).toBe(7);
	});
	it('Info - invalid token', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'Dina_Kris@gmail.com',
			password: '123456',
		});
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer Invalid Token${login.body.jwt}`)
			.send();
		expect(res.statusCode).toBe(401);
	});
	it('Register - error', async () => {
		const res = await request(application.app).post('/users/register').send({
			email: 'Virginia_Sawayn@hotmail.com',
			password: '123456',
		});
		expect(res.statusCode).toBe(422);
	});
});

afterAll(() => {
	application.close();
});
