package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.BookingDetailsDTO;

import java.util.List;

public interface BookingService {
    List<BookingDetailsDTO> getAll();
}
