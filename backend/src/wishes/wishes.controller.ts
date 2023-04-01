import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IUserRequest } from 'src/types';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: IUserRequest) {
    return this.wishesService.create(createWishDto, req);
  }

  @Get('last')
  findLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  findTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWish(
    @Param('id') id: number,
    @Body() wishDto: UpdateWishDto,
    @Req() req,
  ) {
    const wish = await this.wishesService.findOne(id);
    if (wish.owner.id === req.user.id) {
      await this.wishesService.updateOne(id, wishDto);
      return this.wishesService.findOne(id);
    }
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeOne(@Req() req: IUserRequest, @Param('id') id: string) {
    return await this.wishesService.removeOne(+id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(@Param('id') id: string, @Req() req: IUserRequest) {
    return this.wishesService.copyWish(+id, req);
  }
}
