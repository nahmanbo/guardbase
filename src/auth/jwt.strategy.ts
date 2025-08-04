import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
// Handles JWT token validation and attaches payload to req.user
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
    });
  }

  // Returns decoded payload (becomes req.user)
  async validate(payload: any) {
    return {
      id: payload.sub,
      name: payload.name,
      role: payload.role,
    };
  }
}
