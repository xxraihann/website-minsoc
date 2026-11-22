
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE: Menambahkan booking
  async create(createBookingDto: CreateBookingDto) {
    try {
      return await this.prisma.booking.create({
        data: {
          ...createBookingDto,
          status: 'Menunggu Konfirmasi',
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(
          'Jadwal lapangan sudah dibooking.',
        );
      }

      throw error;
    }
  }

  // READ: Menampilkan semua booking
  async findAll() {
    return this.prisma.booking.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  // READ: Menampilkan booking berdasarkan ID
  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(
        `Booking dengan ID ${id} tidak ditemukan.`,
      );
    }

    return booking;
  }

  // UPDATE: Mengubah booking
  async update(id: number, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id);

    try {
      return await this.prisma.booking.update({
        where: { id },
        data: {
          ...updateBookingDto,
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(
          'Jadwal lapangan sudah dibooking.',
        );
      }

      throw error;
    }
  }

  // DELETE: Menghapus booking
  async remove(id: number) {
    const booking = await this.findOne(id);

    await this.prisma.booking.delete({
      where: { id },
    });

    return {
      message: `Booking ${booking.namaPemesan} berhasil dihapus.`,
    };
  }
}
