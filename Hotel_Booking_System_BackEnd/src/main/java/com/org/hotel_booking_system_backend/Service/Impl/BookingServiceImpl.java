package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.BookingDetailsDTO;
import com.org.hotel_booking_system_backend.Entity.Booking;
import com.org.hotel_booking_system_backend.Repo.BookingRepo;
import com.org.hotel_booking_system_backend.Service.BookingService;
import com.org.hotel_booking_system_backend.Util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
}
