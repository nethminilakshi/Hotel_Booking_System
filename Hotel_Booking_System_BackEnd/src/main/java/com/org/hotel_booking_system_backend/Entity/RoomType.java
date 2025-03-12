package com.org.hotel_booking_system_backend.Entity;

import jakarta.persistence.*;


@Entity
@Table(name = "room_type")
public class RoomType {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_id")
    private int typeId;

    @Column(name = "description", nullable = false)
    private String description;

//    @Lob
    private String image;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "qty_on_hand", nullable = false)
    private int qtyOnHand;

    // Getters and Setters


    public RoomType() {
    }

    public RoomType(int typeId, String description, String image, double price, int qtyOnHand) {
        this.typeId = typeId;
        this.description = description;
        this.image = image;
        this.price = price;
        this.qtyOnHand = qtyOnHand;
    }

    public int getTypeId() {
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
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
        return "RoomType{" +
                "typeId=" + typeId +
                ", description='" + description + '\'' +
                ", image='" + image + '\'' +
                ", price=" + price +
                ", qtyOnHand=" + qtyOnHand +
                '}';
    }
}
