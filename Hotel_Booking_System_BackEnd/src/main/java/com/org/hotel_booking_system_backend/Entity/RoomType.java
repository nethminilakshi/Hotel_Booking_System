package com.org.hotel_booking_system_backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.io.Serializable;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "room_type")
public class RoomType implements Serializable {
    @Id
    private String typeId;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(columnDefinition = "LONGTEXT")
    private String image;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "qtyOnHand", nullable = false)
    private int qtyOnHand;

    // Getters and Setters
}
