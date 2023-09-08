import { IsDefined, IsNotEmptyObject, IsNumber, ValidateNested } from 'class-validator';
import { CardDto } from './card.dto';

export class CreateChargeDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  card: CardDto;

  @IsNumber()
  amount: number;
}
