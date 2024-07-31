import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsOptional, Matches, MinLength } from "class-validator"

@InputType()
export class RegisterDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field(() => String)
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    username?: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    phone?: string
}

@InputType()
export class LoginDto{
    @Field(() => String)
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field(() => String)
    @IsNotEmpty()
    @MinLength(6)
    password: string
}