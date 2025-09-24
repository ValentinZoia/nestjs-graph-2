import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserAuthEntity } from '../entities/auth.entity';
import { AuthService } from '../services/auth.service';
import { SignUpInput } from '../dto/signup.input';
import { UpdateAuthInput } from '../dto/update-auth.input';
import { SignResponse } from '../dto/sign-response';
import { LogInInput } from '../dto/login.input';
import { LogoutResponse } from '../dto/logout-response';

@Resolver(() => UserAuthEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignResponse, { name: 'signup' })
  async signup(
    @Args('signUpInput', { type: () => SignUpInput })
    user: SignUpInput,
  ): Promise<SignResponse> {
    return await this.authService.signup(user);
  }

  @Mutation(() => SignResponse, { name: 'login' })
  async login(
    @Args('logInInput', { type: () => LogInInput })
    credentials: LogInInput,
  ): Promise<SignResponse> {
    return await this.authService.login(credentials);
  }

  @Mutation(() => LogoutResponse, { name: 'logout' })
  async logout(
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<LogoutResponse> {
    return await this.authService.logout(id);
  }

  // @Mutation(() => UserAuthEntity)
  // async updateUser(
  //   @Args('updateAuthInput', { type: () => UpdateAuthInput })
  //   user: UpdateAuthInput,
  // ): Promise<UserAuthEntity> {
  //   return await this.authService.update(user.id, user);
  // }

  // @Mutation(() => String)
  // async removeUser(
  //   @Args('id', { type: () => Int }) id: number,
  // ): Promise<String> {
  //   const mjs = (await this.authService.remove(id))
  //     ? 'User deleted'
  //     : 'User not found';
  //   return mjs;
  // }
}
