import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserAuthEntity } from '../entities/auth.entity';
import { AuthService } from '../services/auth.service';
import { SignUpInput } from '../dto/signup.input';
import { SignResponse } from '../dto/sign-response';
import { LogInInput } from '../dto/login.input';
import { LogoutResponse } from '../dto/logout-response';
import { PublicAccess } from '../decorators/public.decorator';
import { NewTokensResponse } from '../dto/newTokensResponse';
import { CurrentUserId } from '../decorators/currentUserId.decorator';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';

@Resolver(() => UserAuthEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @PublicAccess()
  @Mutation(() => SignResponse, { name: 'signup' })
  async signup(
    @Args('signUpInput', { type: () => SignUpInput })
    user: SignUpInput,
  ): Promise<SignResponse> {
    return await this.authService.signup(user);
  }

  @PublicAccess()
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

  // @PublicAccess()
  // @UseGuards(RefreshTokenGuard)
  @Query(() => String, { name: 'me' })
  async me(@CurrentUserId() userId: string): Promise<String> {
    return userId;
  }

  // @PublicAccess()
  @Query(() => String, { name: 'hello' })
  async hello(): Promise<String> {
    return 'hello';
  }

  @PublicAccess()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokensResponse, { name: 'getNewTokens' })
  async getNewTokens(
    @CurrentUserId()
    userId: number,
    @CurrentUser('refreshToken')
    rt: string,
  ): Promise<NewTokensResponse> {
    return await this.authService.getNewTokens(userId, rt);
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
