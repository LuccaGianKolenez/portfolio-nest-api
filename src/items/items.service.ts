import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateItemDto) {
    return this.prisma.item.create({
      data: { name: dto.name, price: new Prisma.Decimal(dto.price) },
    });
  }

  findAll() {
    return this.prisma.item.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async update(id: string, dto: UpdateItemDto) {
    await this.findOne(id);
    return this.prisma.item.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.price !== undefined ? { price: new Prisma.Decimal(dto.price) } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.item.delete({ where: { id } });
    return { deleted: true };
  }
}
