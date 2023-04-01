import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}
  async create(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (!wish) {
      throw new NotFoundException('Такого подарка нет');
    }

    if (user.id === wish.owner.id) {
      throw new ForbiddenException('Нельзя скинуться на свой подарок');
    }

    const offerSum = Number(wish.raised) + Number(createOfferDto.amount);
    if (+offerSum > wish.price) {
      throw new ForbiddenException('Деньги на подарок уже собраны');
    }

    await this.wishesService.updateOne(wish.id, {
      raised: Number(wish.raised) + Number(createOfferDto.amount),
    });
    const updateWish = await this.wishesService.findOne(wish.id);
    delete createOfferDto.itemId;
    return this.offersRepository.save({
      ...createOfferDto,
      user,
      item: updateWish,
    });
  }

  async findAll() {
    const offers = await this.offersRepository.find({
      relations: ['item', 'user'],
    });
    if (offers.length === 0) {
      throw new NotFoundException('Пока еще никто не делал предложений');
    }
    return offers;
  }

  async findOne(id: number) {
    return this.offersRepository.find({
      where: { id },
      relations: ['item', 'user'],
    });
  }
}
