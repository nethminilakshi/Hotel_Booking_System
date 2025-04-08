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
    @Query("SELECT COUNT(b) FROM Booking b " +
            "WHERE b.room.hotel.hotelId = :hotelId " +
            "AND b.room.roomType.typeId = :roomTypeId " +
            "AND b.checkIn < :checkout " +
            "AND b.checkOut > :checkin " +
            "AND b.time = :time " +
            "AND b.status = 'CONFIRMED'")
    int countBookingsByHotelAndRoomTypeAndDateRange(
            @Param("hotelId") UUID hotelId,
            @Param("roomTypeId") UUID roomTypeId,
            @Param("checkin") LocalDate checkin,
            @Param("checkout") LocalDate checkout,
            @Param("time") String time);



}
