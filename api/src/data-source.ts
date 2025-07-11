import { config as dotenv } from 'dotenv';

dotenv();

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './config/database.config';

export const AppDataSource = new DataSource(config);
