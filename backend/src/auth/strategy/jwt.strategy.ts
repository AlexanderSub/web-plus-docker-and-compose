import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('secretKey') || 'jwt_secret',
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = await this.usersService.findById(jwtPayload.sub);

    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return user;
  }
}
