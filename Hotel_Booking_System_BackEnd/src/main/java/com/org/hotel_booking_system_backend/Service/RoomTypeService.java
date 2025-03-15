package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;

import java.util.List;

public interface RoomTypeService {

   void save(RoomTypeDTO roomTypeDTO);

    List<RoomTypeDTO> getAll();


    void delete(String id);

    RoomTypeDTO getSelectedType(String roomTypeCode);

    void update(RoomTypeDTO updateRoomTypeDTO);
}
