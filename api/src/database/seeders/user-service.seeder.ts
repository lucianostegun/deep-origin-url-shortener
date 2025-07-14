import { INestApplicationContext } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class UserServiceSeeder {
  public static async run(app: INestApplicationContext): Promise<void> {
    console.log('🌱 Starting UserService seeder...');

    const usersService = app.get(UsersService);

    try {
      const userCount = await usersService.count();

      if (userCount > 0) {
        console.log('Users already exist in the database. Skipping seeder.');
        return;
      }

      const users: CreateUserDto[] = [
        {
          email: 'john.doe@example.com',
          name: 'John Doe',
        },
        {
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
        },
        {
          email: 'rick.sanchez@example.com',
          name: 'Rick Sanchez',
        },
      ];

      // Create users using the service
      const createdUsers = await usersService.createMultiple(users);

      console.log('✅ Users seeded successfully!');
      console.log('📧 Created users:');
      createdUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email})`);
      });
    } catch (error) {
      console.error('❌ Error seeding users:', error);
      throw error;
    } finally {
      await app.close();
    }
  }
}
