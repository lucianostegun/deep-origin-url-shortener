import { Exclude, Expose } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @Exclude()
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  public id!: number;

  @Expose({ name: 'id' })
  @Column({
    name: 'public_id',
  })
  public publicId!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ length: 255, nullable: true })
  name?: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt!: Date;
}
