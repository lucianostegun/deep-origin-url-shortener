import { Exclude, Expose } from 'class-transformer';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Url {
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
}
