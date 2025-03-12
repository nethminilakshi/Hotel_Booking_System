package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.HotelDTO;

import java.io.IOException;
import java.util.List;

public interface HotelService {
    void save(HotelDTO hotelDTO) throws IOException;

    List<HotelDTO> getAll();

    void update(HotelDTO hotelDTO) throws IOException;

    void delete(long id);
}
