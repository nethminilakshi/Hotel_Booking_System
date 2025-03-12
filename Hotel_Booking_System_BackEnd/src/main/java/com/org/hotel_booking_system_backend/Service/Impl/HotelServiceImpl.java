package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.HotelDTO;
import com.org.hotel_booking_system_backend.Entity.Hotel;
import com.org.hotel_booking_system_backend.Repo.HotelRepo;
import com.org.hotel_booking_system_backend.Service.HotelService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class HotelServiceImpl implements HotelService {

 @Autowired
    private HotelRepo hotelRepo;
 @Autowired
    private ModelMapper modelMapper;

    @Override
    public void save(HotelDTO hotelDTO) throws IOException {
      if(hotelRepo.existsById(hotelDTO.getHotelId())){
            throw new RuntimeException("Hotel already exist");
      }
        Hotel hotel = modelMapper.map(hotelDTO, Hotel.class);
      if (hotelDTO.getImage() != null && !hotelDTO.getImage().isEmpty()) {
            hotel.setImage(hotelDTO.getImage().getBytes().toString());
      }
        try {
            hotelRepo.save(hotel);
        } catch (Exception e) {
            System.out.println("Error saving to database: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<HotelDTO> getAll() {
        return modelMapper.map(hotelRepo.findAll(), new TypeToken<List<HotelDTO>>() {
        }.getType());
    }

    @Override
    public void update(HotelDTO hotelDTO) throws IOException {
        if (hotelRepo.existsById(hotelDTO.getHotelId())) {
            Hotel hotel = modelMapper.map(hotelDTO, Hotel.class);
            if (hotelDTO.getImage() != null && !hotelDTO.getImage().isEmpty()) {
                hotel.setImage(hotelDTO.getImage().getBytes().toString());
            }
            hotelRepo.save(hotel);
        } else {
            throw new RuntimeException("Hotel does not found");
        }
    }

    @Override
    public void delete(long id) {
        if (hotelRepo.existsById(id)) {
            hotelRepo.deleteById(id);
        } else {
            throw new RuntimeException("Hotel does not found");
        }
    }

}
