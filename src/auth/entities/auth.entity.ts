import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserAuthEntity {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  name: string;
  @Field(() => String)
  email: string;
}
