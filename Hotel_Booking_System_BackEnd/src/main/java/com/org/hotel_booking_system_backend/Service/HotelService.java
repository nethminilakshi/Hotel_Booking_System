package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.HotelDTO;

import java.io.IOException;

public interface HotelService {
    void save(HotelDTO hotelDTO) throws IOException;
}
