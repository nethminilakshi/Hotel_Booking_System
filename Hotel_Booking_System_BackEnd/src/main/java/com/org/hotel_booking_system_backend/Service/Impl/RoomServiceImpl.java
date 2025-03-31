package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Entity.Room;
import com.org.hotel_booking_system_backend.Repo.RoomRepo;
import com.org.hotel_booking_system_backend.Service.RoomService;
import com.org.hotel_booking_system_backend.Util.AppUtil;
import com.org.hotel_booking_system_backend.Util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomServiceImpl implements RoomService {
    @Autowired
    private RoomRepo roomRepo;
    @Autowired
    private Mapping mapper;

    @Override
    public Room save(RoomDTO roomDTO) {
        Room room = mapper.convertToRoomEntity(roomDTO);

        if (room.getRoomId() == null || room.getRoomId().isEmpty()){
            room.setRoomId(AppUtil.createRoomCode());
        }
if(roomRepo.existsById(room.getRoomId())){
            throw new RuntimeException("Room already exists");
        }
        roomRepo.save(room);
        return room;
    }

    @Override
    public List<RoomDTO> getAll() {
        List<Room> getAllRooms = roomRepo.findAll();
        return mapper.convertRoomToDTOList(getAllRooms);
    }


    @Override
    public void update(RoomDTO roomDTO) {
        Optional<Room> room = roomRepo.findById(roomDTO.getRoomId());
        if (!room.isPresent()) {
            throw new RuntimeException("Room not Found");
        } else {
            Room rooms = room.get();
            rooms.setAvailability(roomDTO.getAvailability());
            rooms.setFloorNumber(roomDTO.getFloorNumber());

            // Save the updated entity
            roomRepo.save(rooms);  // This line ensures the entity is saved to the database
        }
    }

    @Override
    public void delete(String id) {
        Optional<Room> findId = roomRepo.findById(id);
        if (!findId.isPresent()){
            throw new RuntimeException("Room not Found");
        }else {
            roomRepo.deleteById(id);
        }
    }


}
