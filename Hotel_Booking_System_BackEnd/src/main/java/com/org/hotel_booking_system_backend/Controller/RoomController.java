package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Entity.Room;
import com.org.hotel_booking_system_backend.Service.RoomService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/v1/room")
@CrossOrigin(origins = "http://localhost:63342")
public class RoomController{
    private List<RoomDTO> rooms = new ArrayList<>();
@Autowired
private RoomService roomService;

    @PostMapping(path = "save")
    public ResponseUtil saveRoom(@RequestBody RoomDTO roomDTO){
        try{
            Room savedRoom = roomService.save(roomDTO);
return new ResponseUtil(201,"Room Saved", savedRoom);
        }catch (Exception e){
            return new ResponseUtil(500, e.getMessage(), null);
        }
    }
    @GetMapping("getAll")
    public ResponseUtil getAllRooms(){

        List<RoomDTO> rooms = roomService.getAll();
        return new ResponseUtil(200, "Room is updated", rooms);
    }
    @PutMapping("update")
    public ResponseUtil updateRoom(@RequestBody RoomDTO roomDTO){
        roomService.update(roomDTO);
        return new ResponseUtil(200, "Room is updated", null);
    }
    @DeleteMapping(path = "delete/{id}")
    public ResponseUtil deleteRoom(@PathVariable(value = "id") String id){
        roomService.delete(id);
        return new ResponseUtil(200, "Room is deleted", null);
    }
}
