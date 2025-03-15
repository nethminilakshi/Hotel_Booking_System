package com.org.hotel_booking_system_backend.Util;

import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;
import com.org.hotel_booking_system_backend.Entity.RoomType;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class Mapping {
    @Autowired
    private ModelMapper modelMapper;

    public Mapping() {
        this.modelMapper = new ModelMapper();
    }

    //VehicleEntity and DTO
    public RoomTypeDTO convertToRoomTypeDTO(RoomType roomType){
        return modelMapper.map(roomType, RoomTypeDTO.class);
    }
    public RoomType convertToRoomTypeEntity(RoomTypeDTO dto){
        return modelMapper.map(dto, RoomType.class);
    }
    public List<RoomTypeDTO> convertroomTypeToDTOList(List<RoomType> roomTypes){
        return modelMapper.map(roomTypes, new TypeToken<List<RoomTypeDTO>>(){}.getType());
    }

}
