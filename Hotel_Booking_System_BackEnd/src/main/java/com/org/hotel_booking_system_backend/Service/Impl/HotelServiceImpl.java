package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.HotelDTO;
import com.org.hotel_booking_system_backend.Entity.Hotel;
import com.org.hotel_booking_system_backend.Repo.HotelRepo;
import com.org.hotel_booking_system_backend.Service.HotelService;
import com.org.hotel_booking_system_backend.Util.AppUtil;
import com.org.hotel_booking_system_backend.Util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class HotelServiceImpl implements HotelService {

 @Autowired
    private HotelRepo hotelRepo;
 @Autowired
    private Mapping mapper;

    @Override
    public void save(HotelDTO hotelDTO) throws IOException {
        Hotel hotel = mapper.convertToHotelEntity(hotelDTO);

        if (hotel.getHotelId() == null || hotel.getHotelId().isEmpty()){
            hotel.setHotelId(AppUtil.createHotelCode());
        }

        hotelRepo.save(hotel);
    }

    @Override
    public List<HotelDTO> getAll() {
        List<Hotel> getAllHotels = hotelRepo.findAll();
        return mapper.convertHotelToDTOList(getAllHotels);
    }


    @Override
    public void update(HotelDTO hotelDTO) throws IOException {
//        if (hotelRepo.existsById(hotelDTO.getHotelId())) {
//            Hotel hotel = modelMapper.map(hotelDTO, Hotel.class);
//            if (hotelDTO.getImage() != null && !hotelDTO.getImage().isEmpty()) {
//                hotel.setImage(hotelDTO.getImage().getBytes().toString());
//            }
//            hotelRepo.save(hotel);
//        } else {
//            throw new RuntimeException("Hotel does not found");
//        }
    }

    @Override
    public void delete(String id) {
        Optional<Hotel> findId = hotelRepo.findById(id);
        if (!findId.isPresent()){
            throw new RuntimeException("Hotel not Found");
        }else {
            hotelRepo.deleteById(id);
        }
    }

    @Override
    public HotelDTO getHotelId(String hotelId) {
        if (hotelRepo.existsById(hotelId)) {
            Hotel getById = hotelRepo.getReferenceById(hotelId);
            return mapper.convertToHotelDTO(getById);
        }
            throw  new RuntimeException("Hotel not Found");
        }
    }


