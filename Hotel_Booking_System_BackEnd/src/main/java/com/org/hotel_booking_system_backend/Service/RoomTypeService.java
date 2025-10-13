package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;

import java.util.List;
import java.util.UUID;

public interface RoomTypeService {

   void save(RoomTypeDTO roomTypeDTO);

    List<RoomTypeDTO> getAll();


    void delete(UUID id);

    RoomTypeDTO getSelectedType(UUID roomTypeCode);


    void update(RoomTypeDTO updateRoomTypeDTO);

    RoomTypeDTO getRoomTypeById(UUID roomTypeId);

    void updateRoomTypeQuantity(UUID roomTypeId, int roomCount);
}
