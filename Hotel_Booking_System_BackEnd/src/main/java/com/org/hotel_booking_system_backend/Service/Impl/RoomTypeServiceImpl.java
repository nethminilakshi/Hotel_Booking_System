package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;
import com.org.hotel_booking_system_backend.Entity.RoomType;
import com.org.hotel_booking_system_backend.Repo.RoomTypeRepo;
import com.org.hotel_booking_system_backend.Service.RoomTypeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {
    @Autowired
    private RoomTypeRepo roomTypeRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public boolean save(RoomTypeDTO roomTypeDTO) throws IOException {
        if (roomTypeRepo.existsById(roomTypeDTO.getTypeId())) {
            throw new RuntimeException("Item already exists");
        }
        RoomType roomType = modelMapper.map(roomTypeDTO, RoomType.class);
        if (roomTypeDTO.getImage() != null && !roomTypeDTO.getImage().isEmpty()) {
            roomType.setImage(roomTypeDTO.getImage().getBytes().toString());
        }

        try {
            roomTypeRepo.save(roomType);
            return true;
        } catch (Exception e) {
            System.out.println("Error saving to database: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<RoomTypeDTO> getAll() {
        return modelMapper.map(roomTypeRepo.findAll(), new org.modelmapper.TypeToken<List<RoomTypeDTO>>() {
        }.getType());
    }

    @Override
    public void update(RoomTypeDTO roomTypeDTO) {
        if (roomTypeRepo.existsById(roomTypeDTO.getTypeId())) {
            RoomType roomType = modelMapper.map(roomTypeDTO, RoomType.class);
            if (roomTypeDTO.getImage() != null && !roomTypeDTO.getImage().isEmpty()) {
                try {
                    roomType.setImage(roomTypeDTO.getImage().getBytes().toString());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            roomTypeRepo.save(roomType);
        } else {
            throw new RuntimeException("Room Type does not exist");
        }
    }

    @Override
    public void delete(long id) {
        if (roomTypeRepo.existsById(id)) {
            roomTypeRepo.deleteById(id);
        } else {
            throw new RuntimeException("Room Type does not exist");
        }
    }
}
