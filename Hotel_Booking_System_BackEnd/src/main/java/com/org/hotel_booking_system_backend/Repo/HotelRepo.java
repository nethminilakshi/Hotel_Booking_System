package com.org.hotel_booking_system_backend.Repo;

import com.org.hotel_booking_system_backend.Entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepo extends JpaRepository<Hotel, String> {
}
