import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { SignUpInput } from './signup.input';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class UpdateAuthInput extends PartialType(SignUpInput) {
  @IsNotEmpty()
  @Field(() => Int)
  id: number;
}
