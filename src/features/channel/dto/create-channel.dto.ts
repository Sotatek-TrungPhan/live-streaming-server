import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ description: 'The name of the channel' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The description of the channel' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Whether the channel is private or public' })
  @IsBoolean()
  isPrivate: boolean;
}
