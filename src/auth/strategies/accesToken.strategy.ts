import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';

import { JwtPayload } from '../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(public config: ConfigService) {
    super({
      //define donde buscar el token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //clave para verificar la firma
      secretOrKey: config.get('ACCESS_JWT_SECRET'),
      ignoreExpiration: false,
    } as StrategyOptionsWithRequest);
  }

  //se ejecuta despues de validar el token
  validate(payload: JwtPayload) {
    //extrae el payload
    console.log('🚗 AccessToken validate() ejecutándose');
    console.log('payload', payload.email);
    //el retorno se adjunta a req.user
    return payload;
  }
}
