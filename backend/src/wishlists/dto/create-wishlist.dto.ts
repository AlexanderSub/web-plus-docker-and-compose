import { Length, IsUrl, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsOptional()
  @Length(0, 1500)
  description?: string;

  @IsUrl()
  image?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId?: number[];
}
