import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hash,
    });
    const user = await this.usersRepository.save(newUser);
    delete user.password;
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();

    return users;
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Пользователь не найден');

    if (user.password) delete user.password;

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
      select: [
        'id',
        'password',
        'email',
        'createdAt',
        'updatedAt',
        'about',
        'avatar',
      ],
    });

    return user;
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hash = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hash;
    }

    await this.usersRepository.update({ id }, updateUserDto);
    const user = await this.findById(id);

    return user;
  }

  async findMany({ query }: FindUserDto): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
    if (!users) {
      throw new NotFoundException('Пользователь не найден');
    }

    users.map((data) => {
      if (Array.isArray(data)) data.forEach((obj) => delete obj.password);
      if (data.password) delete data.password;
    });

    return users;
  }
}
