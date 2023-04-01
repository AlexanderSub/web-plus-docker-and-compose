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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IUserRequest } from 'src/types';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: IUserRequest,
  ) {
    return this.wishlistsService.create(createWishlistDto, req);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Req() req: IUserRequest,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(req.user, +id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Req() req: IUserRequest, @Param('id') id: string) {
    return this.wishlistsService.remove(+id, req.user.id);
  }
}
