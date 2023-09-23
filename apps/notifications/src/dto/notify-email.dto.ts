import { IsString } from 'class-validator';

export class NotifyEmailDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly message: string;
}
