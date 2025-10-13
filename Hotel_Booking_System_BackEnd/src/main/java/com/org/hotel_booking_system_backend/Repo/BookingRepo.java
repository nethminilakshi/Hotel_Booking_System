package com.org.hotel_booking_system_backend.Repo;

import com.org.hotel_booking_system_backend.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepo extends JpaRepository<Booking, UUID> {
    @Query("SELECT b FROM Booking b WHERE b.hotel.hotelId = :hotelId " +
            "AND b.roomType.typeId = :roomTypeId " +
            "AND :date BETWEEN b.checkIn AND b.checkOut " +
            "AND b.time = :time " +
            "AND b.status != 'CANCELLED'")
    List<Booking> findBookingsForDateAndTime(@Param("hotelId") UUID hotelId,
                                             @Param("roomTypeId") UUID roomTypeId,
                                             @Param("date") LocalDate date,
                                             @Param("time") String time);

}
