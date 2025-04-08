package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.BookingDetailsDTO;
import com.org.hotel_booking_system_backend.Entity.Booking;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface BookingService {
    List<BookingDetailsDTO> getAll();

    Booking save(BookingDetailsDTO bookingDetailsDTO);

    int countBookedRooms(UUID hotelId, UUID roomTypeId, LocalDate checkin, LocalDate checkout);
}
