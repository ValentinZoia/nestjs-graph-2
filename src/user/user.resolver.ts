import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';
import { CreateUserInput } from './dtos/create-user.input';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserEntity])
  async users(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Mutation(() => UserEntity)
  async createUser(@Args('user') user: CreateUserInput): Promise<UserEntity> {
    return await this.userService.create(user);
  }
}
