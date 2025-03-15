package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Entity.Room;
import com.org.hotel_booking_system_backend.Repo.RoomRepo;
import com.org.hotel_booking_system_backend.Service.RoomService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {
    @Autowired
    private RoomRepo roomRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void save(RoomDTO roomDTO) {
if(roomRepo.existsById(roomDTO.getRoomId())){
    throw new RuntimeException("Room already exist");
    }
    roomRepo.save(modelMapper.map(roomDTO, Room.class));
    }

    @Override
    public List<RoomDTO> getAll() {
return modelMapper.map(roomRepo.findAll(),
        new TypeToken<List<RoomDTO>>()
        {}.getType());
    }

    @Override
    public void update(RoomDTO roomDTO) {
    if(roomRepo.existsById(roomDTO.getRoomId())){
    roomRepo.save(modelMapper.map(roomDTO, Room.class));
    }
    throw new RuntimeException("Room does not found");
    }

    @Override
    public void delete(Long id) {
if(roomRepo.existsById(id)){
    roomRepo.deleteById(id);
}else{
    throw new RuntimeException("Room does not found");
}
    }


}
