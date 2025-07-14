import { NestFactory } from '@nestjs/core';
import { UserServiceSeeder } from './user-service.seeder';
import { AppModule } from '../../app.module';

async function runSeeders() {
  try {
    const nodeEnv = process.env.NODE_ENV;

    if (nodeEnv === 'production') {
      console.error('❌ ERROR: Seeders cannot be executed in production environment!');
      console.error('💡 Seeders are intended for development and testing purposes only.');
      process.exit(1);
    }

    console.log('🌱 Running database seeders...');
    console.log(`📍 Environment: ${nodeEnv || 'development'}`);

    const app = await NestFactory.createApplicationContext(AppModule);

    await UserServiceSeeder.run(app);

    console.log('🎉 All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeders:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  void runSeeders();
}

export default runSeeders;
