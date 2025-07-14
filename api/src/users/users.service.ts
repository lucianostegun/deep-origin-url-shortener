import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ulid } from 'ulid';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      publicId: ulid(),
      ...createUserDto,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findByPublicId(publicId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { publicId },
    });
  }

  async count(): Promise<number> {
    return await this.userRepository.count();
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async createMultiple(users: CreateUserDto[]): Promise<User[]> {
    const userEntities = users.map((userData) =>
      this.userRepository.create({
        ...userData,
        publicId: ulid(),
      }),
    );

    return await this.userRepository.save(userEntities);
  }
}
