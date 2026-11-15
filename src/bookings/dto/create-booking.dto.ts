
import {
  IsString,
  IsEmail,
  IsDateString,
  IsInt,
  Min,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @MinLength(3)
  namaPemesan: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  namaLapangan: string;

  @IsDateString()
  tanggal: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'Format jam harus HH:mm, contoh 19:00',
  })
  jam: string;

  @IsInt()
  @Min(1)
  durasi: number;

  @IsInt()
  @Min(1)
  jumlahPemain: number;
}
