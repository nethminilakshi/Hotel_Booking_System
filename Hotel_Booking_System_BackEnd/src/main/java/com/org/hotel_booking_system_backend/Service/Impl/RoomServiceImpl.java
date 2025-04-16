package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Entity.Room;
import com.org.hotel_booking_system_backend.Repo.RoomRepo;
import com.org.hotel_booking_system_backend.Service.RoomService;
import com.org.hotel_booking_system_backend.Util.AppUtil;
import com.org.hotel_booking_system_backend.Util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepo roomRepo;

    @Autowired
    private Mapping mapper;

    @Override
    public Room save(RoomDTO roomDTO) {
        Room room = mapper.convertToRoomEntity(roomDTO);

        if (room.getRoomId() == null || room.getRoomId().isEmpty()) {
            room.setRoomId(AppUtil.createRoomCode());
        }

        if (roomRepo.existsById(room.getRoomId())) {
            throw new RuntimeException("Room already exists");
        }

        return roomRepo.save(room);
    }

    @Override
    public List<RoomDTO> getAll() {
        List<Room> allRooms = roomRepo.findAll();
        return mapper.convertRoomToDTOList(allRooms);
    }

    @Override
    public void update(RoomDTO roomDTO) {
        Optional<Room> optionalRoom = roomRepo.findById(roomDTO.getRoomId());

        if (!optionalRoom.isPresent()) {
            throw new RuntimeException("Room not found");
        }

        Room room = optionalRoom.get();
        room.setFloorNumber(roomDTO.getFloorNumber());

        // If you want to allow changing the roomType and hotel as well:
        // room.setRoomType( ... );
        // room.setHotel( ... );

        roomRepo.save(room);
    }

    @Override
    public void delete(String id) {
        if (!roomRepo.existsById(id)) {
            throw new RuntimeException("Room not found");
        }

        roomRepo.deleteById(id);
    }

    @Override
    public List<RoomDTO> getRoomTypesByHotel(UUID hotelId) {

        List<Room> roomTypes = roomRepo.findByHotel_HotelId(hotelId);
        if (roomTypes.isEmpty()) {
            throw new RuntimeException("No room types found for the specified hotel");
        }
        return mapper.convertRoomToDTOList(roomTypes);
    }
}
