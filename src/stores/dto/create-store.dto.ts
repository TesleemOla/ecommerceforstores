import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
