package com.org.hotel_booking_system_backend.Dto;

import org.springframework.web.multipart.MultipartFile;

public class HotelDTO {

    private Long hotelId;
    private String name;
    private String location; // Different locations (branches)
    private String description;
    private MultipartFile image;
    private Long Manager; // Reference to User entity

    public HotelDTO() {

    }

    public HotelDTO(Long hotelId, String name, String location, String description, MultipartFile image, Long manager) {
        this.hotelId = hotelId;
        this.name = name;
        this.location = location;
        this.description = description;
        this.image = image;
        Manager = manager;
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

    public Long getManager() {
        return Manager;
    }

    public void setManager(Long manager) {
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
