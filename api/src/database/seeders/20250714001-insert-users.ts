import { DataSource } from 'typeorm';
import { ulid } from 'ulid';

export class UserSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const existingUsers = (await queryRunner.query(
        'SELECT COUNT(*) as count FROM users',
      )) as Array<{ count: string }>;

      if (parseInt(existingUsers[0].count) > 0) {
        console.log('Users already exist in the database. Skipping seeder.');

        await queryRunner.commitTransaction();

        return;
      }

      const users = [
        {
          public_id: ulid(),
          email: 'john.doe@example.com',
          name: 'John Doe',
        },
        {
          public_id: ulid(),
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
        },
        {
          public_id: ulid(),
          email: 'rick.sanchez@example.com',
          name: 'Rick Sanchez',
        },
      ];

      // Insert users
      for (const user of users) {
        await queryRunner.query(
          `INSERT INTO users (public_id, email, name) VALUES (?, ?, ?)`,
          [user.public_id, user.email, user.name],
        );
      }

      await queryRunner.commitTransaction();
      console.log('✅ Users seeded successfully!');
      console.log('📧 Created users:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email})`);
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error seeding users:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
