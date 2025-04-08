package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.BookingDetailsDTO;
import com.org.hotel_booking_system_backend.Entity.Booking;
import com.org.hotel_booking_system_backend.Repo.BookingRepo;
import com.org.hotel_booking_system_backend.Service.BookingService;
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
    @Transactional
    @Override
    public List<BookingDetailsDTO> getAll() {
        List<Booking> AllBookings = bookingRepo.findAll();
        return mapping.convertBookingToDTOList(AllBookings);

    }

    @Override
    public Booking save(BookingDetailsDTO bookingDetailsDTO) {
        Booking booking = mapping.convertToBookingEntity(bookingDetailsDTO);
        if (booking.getBookingId() == null) {
            booking.setBookingId(UUID.randomUUID());
        }
        if (bookingRepo.existsById(UUID.fromString(String.valueOf(booking.getBookingId())))) {
            throw new RuntimeException("Booking already exists");
        }
        return bookingRepo.save(booking);
    }

    @Override
    public int countBookedRooms(UUID hotelId, UUID roomTypeId, LocalDate checkin, LocalDate checkout, String time) {
        return bookingRepo.countBookingsByHotelAndRoomTypeAndDateRange(hotelId, roomTypeId, checkin, checkout,time);
    }
}
