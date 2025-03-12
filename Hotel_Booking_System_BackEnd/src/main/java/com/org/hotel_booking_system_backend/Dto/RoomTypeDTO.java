package com.org.hotel_booking_system_backend.Dto;

import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;

public class RoomTypeDTO {

    private int typeId;
    private String description;
    private double price;
    private int qtyOnHand;
    private MultipartFile image;

    public RoomTypeDTO() {
    }

    public RoomTypeDTO(int typeId, String description, double price, int qtyOnHand, MultipartFile image) {
        this.typeId = typeId;
        this.description = description;
        this.price = price;
        this.qtyOnHand = qtyOnHand;
        this.image = image;
    }

    public long getTypeId() {
        return typeId;
    }

    public void setTypeId(int typeId) {
        this.typeId = typeId;
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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQtyOnHand() {
        return qtyOnHand;
    }

    public void setQtyOnHand(int qtyOnHand) {
        this.qtyOnHand = qtyOnHand;
    }

    @Override
    public String toString() {
        return "RoomTypeDTO{" +
                "typeId=" + typeId +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", qtyOnHand=" + qtyOnHand +
                ", image=" + image +
                '}';
    }
}
