import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';


export abstract class UpdateUserDto {
  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  telephone: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  newPassword: string;
}
