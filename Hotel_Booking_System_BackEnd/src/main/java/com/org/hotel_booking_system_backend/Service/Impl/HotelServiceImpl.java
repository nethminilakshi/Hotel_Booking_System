package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.HotelDTO;
import com.org.hotel_booking_system_backend.Entity.Hotel;
import com.org.hotel_booking_system_backend.Entity.User;
import com.org.hotel_booking_system_backend.Repo.HotelRepo;
import com.org.hotel_booking_system_backend.Repo.UserRepo;
import com.org.hotel_booking_system_backend.Service.HotelService;
import com.org.hotel_booking_system_backend.Util.AppUtil;
import com.org.hotel_booking_system_backend.Util.Mapping;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class HotelServiceImpl implements HotelService {

 @Autowired
    private HotelRepo hotelRepo;
 @Autowired
    private Mapping mapper;
  static Logger logger = Logger.getLogger(HotelServiceImpl.class.getName());

    @Autowired
    private UserRepo userRepository;  // Assuming UserRepository exists for Manager

    @Transactional
    @Override
    public void save(HotelDTO hotelDTO) throws IOException {
        Hotel hotel = mapper.convertToHotelEntity(hotelDTO);
        logger.info("Mapped Hotel Entity: " + hotel);

        if (hotel.getHotelId() == null || hotel.getHotelId().isEmpty()) {
            hotel.setHotelId(AppUtil.createHotelCode());
        }

        //  Fetch the manager properly inside a transaction
        User manager = userRepository.findById(hotelDTO.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found!"));

        //  Avoid Lazy Initialization Exception
        Hibernate.initialize(manager.getManagedHotels()); // Force load if needed

        hotel.setManager(manager);

        hotelRepo.save(hotel);
        logger.info("Hotel saved successfully");
    }



    @Override
    public List<HotelDTO> getAll() {
        List<Hotel> getAllHotels = hotelRepo.findAll();
        return mapper.convertHotelToDTOList(getAllHotels);
    }


    @Override
    public void update(HotelDTO hotelDTO) throws IOException {
        Optional<Hotel> hotel = hotelRepo.findById(hotelDTO.getHotelId());
        if (!hotel.isPresent()) {
            throw new RuntimeException("Hotel not Found");
        } else {
            Hotel hotelEntity = hotel.get();
            hotelEntity.setName(hotelDTO.getName());
            hotelEntity.setLocation(hotelDTO.getLocation());
            hotelEntity.setDescription(hotelDTO.getDescription());
            hotelEntity.setImage(hotelDTO.getImage());

            // Save the updated entity
            hotelRepo.save(hotelEntity);  // This line ensures the entity is saved to the database
        }
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
            throw  new RuntimeException("HotelId not Found");
        }
    }


