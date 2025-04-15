package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.BookingDetailsDTO;
import com.org.hotel_booking_system_backend.Entity.Booking;
import com.org.hotel_booking_system_backend.Entity.User;
import com.org.hotel_booking_system_backend.Repo.BookingRepo;
import com.org.hotel_booking_system_backend.Repo.UserRepo;
import com.org.hotel_booking_system_backend.Service.BookingService;
import com.org.hotel_booking_system_backend.Util.JwtUtil;
import com.org.hotel_booking_system_backend.Util.Mapping;
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
    private UserRepo userRepo;
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
    public Booking save(BookingDetailsDTO dto) {
        User user = userRepo.findByEmail(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = mapping.convertToBookingEntity(dto);
        booking.setBookingId(UUID.randomUUID());
        booking.setUser(user);
        booking.setStatus(Booking.BookingStatus.PENDING);

        return bookingRepo.save(booking);
    }

    @Override
    public int countBookedRooms(UUID hotelId, UUID roomTypeId, LocalDate checkin, LocalDate checkout, String time) {
        int count = bookingRepo.countBookingsByHotelAndRoomTypeAndDateRange(hotelId, roomTypeId, checkin, checkout,time);
        System.out.println("Booked rooms count: " + count);
        return count;
    }

}
