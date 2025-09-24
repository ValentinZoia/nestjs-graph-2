import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from 'src/constants/key-decorators';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private readonly reflector: Reflector, // leer atributos de decoradores
  ) {
    super();
  }

  /*Necesitamos crear un graphql context. No podemos usar el
    estandar http context.
  */
  getRequest(context: ExecutionContext) {
    //crear nuevo graphql context
    const ctx = GqlExecutionContext.create(context);
    //retornar request
    return ctx.getContext().req;
  }
}
