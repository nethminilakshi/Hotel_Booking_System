package com.org.hotel_booking_system_backend.Dto;

import com.org.hotel_booking_system_backend.Entity.Room;
import com.org.hotel_booking_system_backend.Entity.User;
import jakarta.persistence.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

public class HotelDTO {

    private Long hotelId;
    private String name;
    private String location; // Different locations (branches)
    private String description;
    private MultipartFile image;
    private User Manager; // Reference to User entity

    public HotelDTO(Long hotelId, String name, String location, String description, MultipartFile image, User manager) {
        this.hotelId = hotelId;
        this.name = name;
        this.location = location;
        this.description = description;
        this.image = image;
        Manager = manager;
    }

    public HotelDTO() {
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }

    public User getManager() {
        return Manager;
    }

    public void setManager(User manager) {
        Manager = manager;
    }

    @Override
    public String toString() {
        return "HotelDTO{" +
                "hotelId=" + hotelId +
                ", name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", description='" + description + '\'' +
                ", image=" + image +
                ", Manager=" + Manager +
                '}';
    }
}
