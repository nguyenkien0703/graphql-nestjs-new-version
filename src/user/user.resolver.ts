import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserPaginationResponse } from './models/user.model';
import { CreateUserDto, UpdateUserDto, UserFilter } from './dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/auth..decorator';

@UseGuards(AuthGuard)
@Resolver()
export class UserResolver {
    constructor(private userService: UserService) { }

    @Query(() => UserPaginationResponse)
    async users(@CurrentUser() user: User, @Args('filter') filter: UserFilter): Promise<UserPaginationResponse> {
        console.log("current user=> ", user)
        return await this.userService.findAll(filter)
    }

    @Query(() => User)
    async user(@Args('id') id: number): Promise<User> {
        return await this.userService.findOne(Number(id))
    }

    @Mutation(() => User)
    async createUser(@Args('userData') userData: CreateUserDto): Promise<User> {
        return await this.userService.create(userData)
    }

    @Mutation(() => User)
    async update(@Args('id') id: number, @Args('dataUpdate') dataUpdate: UpdateUserDto): Promise<User> {
        return await this.userService.update(id, dataUpdate)
    }

    @Mutation(() => Boolean)
    async delete(@Args('id') id: number): Promise<Boolean> {
        return await this.userService.delete(Number(id))
    }
}
