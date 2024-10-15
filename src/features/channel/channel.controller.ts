import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Channel } from './entities/channel.entity';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new channel' })
  @ApiResponse({
    status: 201,
    description: 'The channel has been successfully created.',
    type: Channel,
  })
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all channels' })
  @ApiResponse({
    status: 200,
    description: 'The channels have been successfully retrieved.',
    type: [Channel],
  })
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a channel by ID' })
  @ApiResponse({
    status: 200,
    description: 'The channel has been successfully retrieved.',
    type: Channel,
  })
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a channel' })
  @ApiResponse({
    status: 200,
    description: 'The channel has been successfully updated.',
    type: Channel,
  })
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(id, updateChannelDto);
  }

  @ApiOperation({ summary: 'Delete a channel' })
  @ApiResponse({
    status: 200,
    description: 'The channel has been successfully deleted.',
  })
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The channel has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.channelService.remove(id);
  }
}
