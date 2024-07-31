import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { hash, compare } from 'bcrypt'
import { LoginResponse } from './models/auth.model';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

    async register(userData: RegisterDto): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: userData.email
            }
        })

        if (user) {
            throw new HttpException({ message: "This email has been used!" }, HttpStatus.BAD_REQUEST)
        }

        const hashPass = await hash(userData.password, 10)

        const result = await this.prismaService.user.create({
            data: { ...userData, password: hashPass }
        })

        return result;
    }

    async login(userData: LoginDto): Promise<LoginResponse> {
        //step1: checking user is exist or not

        const user = await this.prismaService.user.findUnique({
            where: {
                email: userData.email
            }
        })

        if (!user) {
            throw new HttpException({ message: "Account not found!" }, HttpStatus.UNAUTHORIZED)
        }

        //step2: check password

        const verify = await compare(userData.password, user.password)

        if (!verify) {
            throw new HttpException({ message: "Incorrect password!" }, HttpStatus.UNAUTHORIZED)
        }

        //step3: generate accessToken and refreshToken
        const payload = {
            id: user.id,
            name: user.username,
            email: user.email
        }

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN_KEY,
            expiresIn: 60
        })

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN_KEY,
            expiresIn: '7d'
        })

        return {
            accessToken,
            refreshToken
        }
    }
}
