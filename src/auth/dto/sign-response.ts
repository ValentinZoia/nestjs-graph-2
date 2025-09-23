import { Field, ObjectType } from '@nestjs/graphql';
import { UserAuthEntity } from '../entities/auth.entity';

@ObjectType()
export class SignResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  user: UserAuthEntity;
}
