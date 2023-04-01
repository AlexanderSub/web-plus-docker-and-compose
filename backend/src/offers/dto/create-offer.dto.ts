import { IsBoolean, Min } from 'class-validator';

export {} from 'class-validator';

export class CreateOfferDto {
  @Min(1)
  amount: number;

  @IsBoolean()
  hidden?: boolean;

  @Min(1)
  itemId: number;
}
