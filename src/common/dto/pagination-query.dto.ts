import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number = 25;
}
