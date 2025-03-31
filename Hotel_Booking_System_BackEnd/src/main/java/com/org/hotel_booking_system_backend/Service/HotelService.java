package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.HotelDTO;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface HotelService {
    void save(HotelDTO hotelDTO) throws IOException;

    List<HotelDTO> getAll();

    void update(HotelDTO hotelDTO) throws IOException;

    void delete(UUID id);

    HotelDTO getHotelId(UUID hotelId);
}
