import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar item' })
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar itens' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter item por ID' })
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar item (parcial)' })
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover item' })
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
