
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];
  private nextId = 1;

  // CREATE: Menambahkan booking
  create(createBookingDto: CreateBookingDto): Booking {
    const isSlotBooked = this.bookings.some(
      (booking) =>
        booking.namaLapangan === createBookingDto.namaLapangan &&
        booking.tanggal === createBookingDto.tanggal &&
        booking.jam === createBookingDto.jam,
    );

    if (isSlotBooked) {
      throw new ConflictException('Jadwal lapangan sudah dibooking.');
    }

    const newBooking: Booking = {
      id: this.nextId++,
      ...createBookingDto,
      status: 'Menunggu Konfirmasi',
    };

    this.bookings.push(newBooking);
    return newBooking;
  }

  // READ: Menampilkan semua booking
  findAll(): Booking[] {
    return this.bookings;
  }

  // READ: Menampilkan booking berdasarkan ID
  findOne(id: number): Booking {
    const booking = this.bookings.find((item) => item.id === id);

    if (!booking) {
      throw new NotFoundException(`Booking dengan ID ${id} tidak ditemukan.`);
    }

    return booking;
  }

  // UPDATE: Mengubah booking
  update(id: number, updateBookingDto: UpdateBookingDto): Booking {
    const booking = this.findOne(id);

    const updatedNamaLapangan =
      updateBookingDto.namaLapangan ?? booking.namaLapangan;
    const updatedTanggal =
      updateBookingDto.tanggal ?? booking.tanggal;
    const updatedJam =
      updateBookingDto.jam ?? booking.jam;

    const isSlotBooked = this.bookings.some(
      (item) =>
        item.id !== id &&
        item.namaLapangan === updatedNamaLapangan &&
        item.tanggal === updatedTanggal &&
        item.jam === updatedJam,
    );

    if (isSlotBooked) {
      throw new ConflictException('Jadwal lapangan sudah dibooking.');
    }

    Object.assign(booking, updateBookingDto);
    return booking;
  }

  // DELETE: Menghapus booking
  remove(id: number): { message: string } {
    const booking = this.findOne(id);

    this.bookings = this.bookings.filter((item) => item.id !== id);

    return {
      message: `Booking ${booking.namaPemesan} berhasil dihapus.`,
    };
  }
}
