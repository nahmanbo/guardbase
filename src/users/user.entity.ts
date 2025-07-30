import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
    SOLDIER = 'soldier',
    COMMANDER = 'commander',
    ADMIN = 'admin',
  }
  
@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.SOLDIER })
  role: UserRole;
}
