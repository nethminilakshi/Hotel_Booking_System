package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Entity.Room;

import java.util.List;

public interface RoomService {
    Room save(RoomDTO roomDTO);

    List<RoomDTO> getAll();

    void update(RoomDTO roomDTO);

    void delete(String id);
}
