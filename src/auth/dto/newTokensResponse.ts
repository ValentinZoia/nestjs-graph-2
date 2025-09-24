import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class NewTokensResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}
