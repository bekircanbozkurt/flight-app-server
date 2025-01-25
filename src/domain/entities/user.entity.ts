import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class User {
  @IsString()
  id: string;

  @IsString()
  @MinLength(2)
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsString()
  password: string;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
