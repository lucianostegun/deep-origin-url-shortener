import { Exclude, Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('urls')
export class Url {
  @Exclude()
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  public id!: number;

  @Expose({ name: 'id' })
  @Column({
    name: 'public_id',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  public publicId!: string;

  @Exclude()
  @Column({
    name: 'user_id',
  })
  public userId!: number;

  @Column({
    name: 'original_url',
    type: 'text',
  })
  public originalUrl!: string;

  @Column({
    name: 'short_url',
    type: 'text',
  })
  public shortUrl!: string;

  @Column({
    name: 'slug',
    type: 'varchar',
    unique: true,
  })
  public slug!: string;

  @Column({
    name: 'click_count',
    type: 'int',
    default: 0,
  })
  public clickCount!: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt!: Date;
}
