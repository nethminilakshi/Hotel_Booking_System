package com.org.hotel_booking_system_backend.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "rooms", uniqueConstraints = @UniqueConstraint(columnNames = {"hotel_id", "floorNumber", "roomNumber"}))
public class Room {

    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private RoomType roomType; // Reference to RoomType entity

    @Column(name = "availability")
    private Boolean availability;

    @Column(name = "floor_number", nullable = false)
    private int floorNumber;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel; // Reference to Hotel entity

    // Getters and Setters

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
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

    @Override
    public String toString() {
        return "Room{" +
                "roomId=" + roomId +
                ", roomType=" + roomType +
                ", availability=" + availability +
                ", floorNumber=" + floorNumber +
                ", hotel=" + hotel +
                '}';
    }
}
