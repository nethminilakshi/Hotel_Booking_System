package com.org.hotel_booking_system_backend.Dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoomTypeDTO implements Serializable {

    private UUID typeId;
    private String name;
    private String description;
    private double price;
    private int qtyOnHand;
    private String image;
    private int noOfPersons;


}

