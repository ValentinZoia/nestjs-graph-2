import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from 'src/constants/key-decorators';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
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

  //Ahora vamos a sobreescribir un metodo de AuthGuard - canActive
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Leer Decorador @Public. Si existe, retorna true
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(), // leer el decorador de la ruta
      context.getClass(), // leer el decorador de la clase
    ]);
    if (isPublic) return true;

    return super.canActivate(context);
  }
}
