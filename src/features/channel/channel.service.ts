import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    const channel = this.channelRepository.create(createChannelDto);
    return this.channelRepository.save(channel);
  }

  async findAll(): Promise<Channel[]> {
    return this.channelRepository.find();
  }

  async findOne(id: string): Promise<Channel> {
    return this.channelRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateChannelDto: UpdateChannelDto,
  ): Promise<Channel> {
    await this.channelRepository.update(id, updateChannelDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.channelRepository.delete(id);
  }
}
