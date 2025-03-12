package com.org.hotel_booking_system_backend.Repo;

import com.org.hotel_booking_system_backend.Entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.*;

public interface RoomTypeRepo extends JpaRepository<RoomType,Long> {
}
