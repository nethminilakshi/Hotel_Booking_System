package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Service.RoomService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/v1/room")
@CrossOrigin
public class RoomController{
    private List<RoomDTO> rooms = new ArrayList<>();
@Autowired
private RoomService roomService;

    @PostMapping(path = "save")
    public ResponseUtil saveRoom(@RequestBody RoomDTO roomDTO){
       roomService.save(roomDTO);
        return new ResponseUtil(201,"Room Saved", null);
    }
    @GetMapping("getAll")
    public ResponseUtil getAllRooms(){

        return new ResponseUtil(200, "Success",roomService.getAll());
    }
    @PutMapping("update")
    public ResponseUtil updateRoom(@RequestBody RoomDTO roomDTO){
        roomService.update(roomDTO);
        return new ResponseUtil(200, "Room is updated", null);
    }
    @DeleteMapping(path = "delete/{id}")
    public ResponseUtil deleteRoom(@PathVariable(value = "id") long id){
        roomService.delete(id);
        return new ResponseUtil(200, "Room is deleted", null);
    }
}
