package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;
import com.org.hotel_booking_system_backend.Service.RoomTypeService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/roomTypeController")
@CrossOrigin(origins = "http://localhost:63342")
public class AdminRoomTypeController {

    @Autowired
    private RoomTypeService roomTypeService;

    @GetMapping(path = "getAll", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getRoomTypes() {
        List<RoomTypeDTO> roomTypes = roomTypeService.getAll();
        for (RoomTypeDTO room : roomTypes) {
            System.out.println("Room ID: " + room.getTypeId()); //  Debugging
        }
        return new ResponseUtil(200, "Success", roomTypes);
    }

}
