package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.BookingDetailsDTO;
import com.org.hotel_booking_system_backend.Entity.Booking;
import com.org.hotel_booking_system_backend.Entity.Hotel;
import com.org.hotel_booking_system_backend.Entity.RoomType;
import com.org.hotel_booking_system_backend.Entity.User;
import com.org.hotel_booking_system_backend.Repo.BookingRepo;
import com.org.hotel_booking_system_backend.Repo.HotelRepo;
import com.org.hotel_booking_system_backend.Repo.RoomTypeRepo;
import com.org.hotel_booking_system_backend.Repo.UserRepo;
import com.org.hotel_booking_system_backend.Service.BookingService;
import com.org.hotel_booking_system_backend.Util.JwtUtil;
import com.org.hotel_booking_system_backend.Util.Mapping;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepo bookingRepo;
    @Autowired
    private Mapping mapping;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private HotelRepo hotelRepo;
    @Autowired
    private RoomTypeRepo roomTypeRepo;
    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    @Override
    public List<BookingDetailsDTO> getAll() {
        List<Booking> AllBookings = bookingRepo.findAll();
        return mapping.convertBookingToDTOList(AllBookings);

    }

    @Override
    @Transactional
    public Booking save(BookingDetailsDTO bookingDTO) {
        try {
            // Debug logging
            System.out.println("BookingDTO: " + bookingDTO);
            System.out.println("Hotel ID: " + bookingDTO.getHotelId());
            System.out.println("Room Type ID: " + bookingDTO.getRoomTypeId());
            System.out.println("Room Count: " + bookingDTO.getRoomCount());

            // Create booking entity with specific attention to ID fields
            Booking booking = new Booking();

            // Set booking fields
            booking.setCheckIn(bookingDTO.getCheckIn());
            booking.setCheckOut(bookingDTO.getCheckOut());
            booking.setRoomCount(bookingDTO.getRoomCount());
            booking.setTime(bookingDTO.getTime());

            // Set status
            if (bookingDTO.getStatus() != null && !bookingDTO.getStatus().isEmpty()) {
                booking.setStatus(Booking.BookingStatus.valueOf(bookingDTO.getStatus().toUpperCase()));
            } else {
                booking.setStatus(Booking.BookingStatus.PENDING);
            }

            // Set User - Important: Make sure we're using a managed entity or a proper reference
            if (bookingDTO.getUser() != null && bookingDTO.getUser().getUserId() != null) {
                User user = new User();
                user.setUserId(bookingDTO.getUser().getUserId());
                booking.setUser(user);
            }

            // Set Hotel - Critical part for fixing the hotel_id error
            if (bookingDTO.getHotel() != null) {
                Hotel hotel = new Hotel();
                hotel.setHotelId(bookingDTO.getHotel().getHotelId());
                booking.setHotel(hotel);
            } else if (bookingDTO.getHotelId() != null) {
                // Get the full hotel object to access its name
                Hotel fullHotel = hotelRepo.findById(bookingDTO.getHotelId()).orElse(null);
                if (fullHotel != null) {
                    Hotel hotel = new Hotel();
                    hotel.setHotelId(bookingDTO.getHotelId());
                    booking.setHotel(hotel);
                }
            }

            // Set RoomType
            if (bookingDTO.getRoomType() != null && bookingDTO.getRoomType().getTypeId() != null) {
                RoomType roomType = new RoomType();
                roomType.setTypeId(bookingDTO.getRoomType().getTypeId());
                booking.setRoomType(roomType);
            } else if (bookingDTO.getRoomTypeId() != null) {
                RoomType roomType = new RoomType();
                roomType.setTypeId(bookingDTO.getRoomTypeId());
                booking.setRoomType(roomType);
            }

            // Save booking entity
            System.out.println("About to save booking with hotel: " +
                    (booking.getHotel() != null ? booking.getHotel().getHotelId() : "null"));

            // CHANGE HERE: Actually return the saved booking
            return bookingRepo.save(booking);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error in save method: " + e.getMessage());
            throw e;
        }
    }

//    @Override
//    public int countBookedRooms(UUID hotelId, UUID roomTypeId, LocalDate checkin, LocalDate checkout, String time) {
//        int count = bookingRepo.countBookingsByHotelAndRoomTypeAndDateRange(hotelId, roomTypeId, checkin, checkout,time);
//        System.out.println("Booked rooms count: " + count);
//        return count;
//    }

    @Override
    public int countBookedRoomsForDateAndTime(UUID hotelId, UUID roomTypeId, LocalDate date, String time) {
        List<Booking> bookings = bookingRepo.findBookingsForDateAndTime(hotelId, roomTypeId, date, time);

        // Sum up the room count from all bookings
        return bookings.stream()
                .mapToInt(Booking::getRoomCount)
                .sum();    }

}
