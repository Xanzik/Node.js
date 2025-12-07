import { verify } from 'jsonwebtoken';

import { IMiddleware } from './middleware.interface';

import type { NextFunction, Request, Response } from 'express';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			if (token) {
				verify(token, this.secret, (err, payload) => {
					if (err) {
						next();
					} else if (payload && typeof payload !== 'string') {
						req.user = payload.email;
						next();
					}
				});
			}
		} else {
			next();
		}
	}
}
