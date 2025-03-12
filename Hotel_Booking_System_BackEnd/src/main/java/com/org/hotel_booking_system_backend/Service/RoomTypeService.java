package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;

import java.io.IOException;
import java.util.List;

public interface RoomTypeService {

    boolean save(RoomTypeDTO roomTypeDTO) throws IOException;

    List<RoomTypeDTO> getAll();

    void update(RoomTypeDTO roomTypeDTO);

    void delete(long id);
}
