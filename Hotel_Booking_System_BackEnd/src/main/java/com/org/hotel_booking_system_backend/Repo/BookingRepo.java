package com.org.hotel_booking_system_backend.Repo;

import com.org.hotel_booking_system_backend.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface BookingRepo extends JpaRepository<Booking, UUID> {
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.hotel.hotelId = :hotelId AND b.roomType.typeId = :roomTypeId " +
            "AND b.checkinDate < :checkout AND b.checkoutDate > :checkin")
    int countOverlappingBookings(
            @Param("hotelId") UUID hotelId,
            @Param("roomTypeId") UUID roomTypeId,
            @Param("checkin") LocalDate checkin,
            @Param("checkout") LocalDate checkout
    );


}
