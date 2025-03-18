package com.org.hotel_booking_system_backend.Dto;

import com.org.hotel_booking_system_backend.Entity.Hotel;
import com.org.hotel_booking_system_backend.Entity.RoomType;

public class RoomDTO {

    private String roomId;
    private RoomType roomType; // Reference to RoomType entity
    private Boolean availability;
    private int floorNumber;
    private Hotel hotel;

    public RoomDTO() {

    }

    public RoomDTO(String roomId, RoomType roomType, Boolean availability, int floorNumber, Hotel hotel) {
        this.roomId = roomId;
        this.roomType = roomType;
        this.availability = availability;
        this.floorNumber = floorNumber;
        this.hotel = hotel;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public Boolean getAvailability() {
        return availability;
    }

    public void setAvailability(Boolean availability) {
        this.availability = availability;
    }

    public int getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(int floorNumber) {
        this.floorNumber = floorNumber;
    }

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }
}
