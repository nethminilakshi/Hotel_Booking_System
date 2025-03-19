package com.org.hotel_booking_system_backend.Dto;

import com.org.hotel_booking_system_backend.Entity.Hotel;
import com.org.hotel_booking_system_backend.Entity.RoomType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoomDTO {

    private String roomId;
    private String roomTypeId; // Reference to RoomType entity
    private Boolean availability;
    private int floorNumber;
    private String hotelId;


}
