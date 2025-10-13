package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;
import com.org.hotel_booking_system_backend.Entity.RoomType;
import com.org.hotel_booking_system_backend.Repo.RoomTypeRepo;
import com.org.hotel_booking_system_backend.Service.RoomTypeService;
import com.org.hotel_booking_system_backend.Util.Mapping;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {

    @Autowired
    private RoomTypeRepo roomTypeRepo;
    @Autowired
    private Mapping mapping;



    @Override
    public void save(RoomTypeDTO roomTypeDTO) {
        RoomType roomType = mapping.convertToRoomTypeEntity(roomTypeDTO);

        roomTypeRepo.save(roomType);
    }


    @Override
    public List<RoomTypeDTO> getAll() {
        List<RoomType> getRoomTypes = roomTypeRepo.findAll();
        return mapping.convertRoomTypeToDTOList(getRoomTypes);

    }

    @Override
    public void delete(UUID id) {
        Optional<RoomType> findId = roomTypeRepo.findById(id);
        if (!findId.isPresent()){
            throw new RuntimeException("RoomType not Found");
        }else {
            roomTypeRepo.deleteById(id);
        }
    }

    @Override
    public RoomTypeDTO getSelectedType(UUID roomTypeCode) {
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
            roomType1.setName(updateRoomTypeDTO.getName());
            roomType1.setDescription(updateRoomTypeDTO.getDescription());
            roomType1.setPrice(updateRoomTypeDTO.getPrice());
            roomType1.setQtyOnHand(updateRoomTypeDTO.getQtyOnHand());
            roomType1.setImage(updateRoomTypeDTO.getImage());
            roomType1.setNoOfPersons(updateRoomTypeDTO.getNoOfPersons());

            // Save the updated entity
            roomTypeRepo.save(roomType1);  // This line ensures the entity is saved to the database
        }
    }

    @Override
    public RoomTypeDTO getRoomTypeById(UUID roomTypeId) {
        Optional<RoomType> roomType = roomTypeRepo.findById(roomTypeId);
        if (roomType.isPresent()) {
            return mapping.convertToRoomTypeDTO(roomType.orElse(null));
        } else {
            throw new RuntimeException("Room Type not found");
        }
    }

    @Override
    @Transactional
    public void updateRoomTypeQuantity(UUID roomTypeId, int roomCount) {
        RoomType roomType = roomTypeRepo.findById(roomTypeId)
                .orElseThrow(() -> new RuntimeException("Room type not found: " + roomTypeId));

        int newQuantity = roomType.getQtyOnHand() - roomCount;
        if (newQuantity < 0) {
            throw new RuntimeException("Not enough rooms available");
        }

        roomType.setQtyOnHand(newQuantity);
        roomTypeRepo.save(roomType);

        System.out.println("Updated room quantity. Previous: " + (newQuantity + roomCount) + ", Current: " + newQuantity);
    }
}
