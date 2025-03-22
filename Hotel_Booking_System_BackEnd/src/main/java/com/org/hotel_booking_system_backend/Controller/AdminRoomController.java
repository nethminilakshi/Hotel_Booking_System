package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Service.RoomService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/v1/roomController")
@CrossOrigin(origins = "http://localhost:63342")
public class AdminRoomController {
    private List<RoomDTO> rooms = new ArrayList<>();
    @Autowired
    private RoomService roomService;

    @GetMapping("getAll")
    public ResponseUtil getAllRooms(){

        List<RoomDTO> rooms = roomService.getAll();
        return new ResponseUtil(200, "Room is updated", rooms);
    }
}
