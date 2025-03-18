package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.RoomDTO;

import java.util.List;

public interface RoomService {
    void save(RoomDTO roomDTO);

    List<RoomDTO> getAll();

    void update(RoomDTO roomDTO);

    void delete(String id);
}
