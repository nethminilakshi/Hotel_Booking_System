package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.BookingDetailsDTO;
import com.org.hotel_booking_system_backend.Entity.Booking;
import com.org.hotel_booking_system_backend.Entity.RoomType;
import com.org.hotel_booking_system_backend.Service.BookingService;
import com.org.hotel_booking_system_backend.Service.RoomTypeService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/Booking")
@CrossOrigin(origins = "http://localhost:63342")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RoomTypeService roomTypeService;

    @GetMapping("getAllHotelBookings")
    public ResponseUtil getBookingsByHotel(UUID hotelID) {
        List<BookingDetailsDTO> bookings = bookingService.getAll();
        return new ResponseUtil(200, "booking details retrieved", bookings);
    }

    @PostMapping(path = "save")
public ResponseUtil addBooking(@RequestBody BookingDetailsDTO bookingDetailsDTO){
        try{
            Booking booking = bookingService.save(bookingDetailsDTO);
            return new ResponseUtil(201,"Room Saved", booking);
        }catch (Exception e){
            return new ResponseUtil(500, e.getMessage(), null);
        }
    }

    @GetMapping("/availability")
    public ResponseUtil getRoomAvailability(@RequestParam UUID hotelId,
                                            @RequestParam UUID roomTypeId,
                                            @RequestParam String checkinDate,
                                            @RequestParam String checkoutDate,
                                            @RequestParam String time) {

        LocalDate checkin = LocalDate.parse(checkinDate);
        LocalDate checkout = LocalDate.parse(checkoutDate);

        // 1. Get RoomType to check total rooms available
        RoomType roomType = roomTypeService.getRoomTypeById(roomTypeId);
        int totalRooms = roomType.getQtyOnHand();

        int  bookedRooms = bookingService.countBookedRooms(hotelId, roomTypeId, checkin, checkout,time);
        int available = totalRooms - bookedRooms;

        if (available > 0) {
            return new ResponseUtil(200, "Room available", available);
        } else {
            return new ResponseUtil(400, "No rooms available", null);
        }
    }
}
