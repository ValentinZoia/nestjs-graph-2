import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload, JwtPayloadWithRefreshToken } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(public config: ConfigService) {
    super({
      //define donde buscar el token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('REFRESH_JWT_SECRET'),
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  // se ejecuta despues de validar el token
  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    console.log('🔄 RefreshStrategy validate() ejecutándose');

    //extrae el token raw del header
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();
    console.log(payload.email, 'payload!');
    console.log(payload.sub, 'payload!');
    console.log(refreshToken, 'refreshToken!');

    //verificar usuario

    //comparar token

    //retornar usuario + token
    return { ...payload, refreshToken };
  }
}
