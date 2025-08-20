import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsNumber, IsPositive } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 1999.9, description: 'Preço com 2 casas decimais' })
  @IsNumber()
  @IsPositive()
  price!: number;
}
