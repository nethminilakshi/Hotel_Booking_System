package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;
import com.org.hotel_booking_system_backend.Entity.RoomType;
import com.org.hotel_booking_system_backend.Repo.RoomTypeRepo;
import com.org.hotel_booking_system_backend.Service.RoomTypeService;
import com.org.hotel_booking_system_backend.Util.AppUtil;
import com.org.hotel_booking_system_backend.Util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {

    @Autowired
    private RoomTypeRepo roomTypeRepo;
    @Autowired
    private Mapping mapping;



    @Override
    public void save(RoomTypeDTO roomTypeDTO) {
        RoomType roomType = mapping.convertToRoomTypeEntity(roomTypeDTO);

        if (roomType.getTypeId() == null || roomType.getTypeId().isEmpty()){
            roomType.setTypeId(AppUtil.createRoomTypeCode());
        }

        roomTypeRepo.save(roomType);
    }


    @Override
    public List<RoomTypeDTO> getAll() {
        List<RoomType> getRoomTypes = roomTypeRepo.findAll();
        return mapping.convertroomTypeToDTOList(getRoomTypes);

    }

    @Override
    public void delete(String id) {
        Optional<RoomType> findId = roomTypeRepo.findById(id);
        if (!findId.isPresent()){
            throw new RuntimeException("RoomType not Found");
        }else {
            roomTypeRepo.deleteById(id);
        }
    }

    @Override
    public RoomTypeDTO getSelectedType(String roomTypeCode) {
        if (roomTypeRepo.existsById(roomTypeCode)) {
            RoomType roomTypeById = roomTypeRepo.getReferenceById(roomTypeCode);
            return mapping.convertToRoomTypeDTO(roomTypeById);
        } else {
            throw new RuntimeException("Room Type not found");
        }    }

    @Override
    public void update(RoomTypeDTO updateRoomTypeDTO) {
        Optional<RoomType> roomType = roomTypeRepo.findById(updateRoomTypeDTO.getTypeId());
        if (!roomType.isPresent()) {
            throw new RuntimeException("Crop not Found");
        } else {
            RoomType roomType1 = roomType.get();
            roomType1.setDescription(updateRoomTypeDTO.getDescription());
            roomType1.setPrice(updateRoomTypeDTO.getPrice());
            roomType1.setQtyOnHand(updateRoomTypeDTO.getQtyOnHand());
            roomType1.setImage(updateRoomTypeDTO.getImage());

            // Save the updated entity
            roomTypeRepo.save(roomType1);  // This line ensures the entity is saved to the database
        }
    }
}
