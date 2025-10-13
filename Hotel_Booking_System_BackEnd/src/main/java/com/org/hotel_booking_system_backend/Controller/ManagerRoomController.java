package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Entity.Room;
import com.org.hotel_booking_system_backend.Service.RoomService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/room")
@CrossOrigin(origins = "http://localhost:63342")
public class ManagerRoomController {
    private List<RoomDTO> rooms = new ArrayList<>();
@Autowired
private RoomService roomService;

    @PostMapping(path = "save")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseUtil> saveRoom(@RequestBody RoomDTO roomDTO){
        try {
            Room savedRoom = roomService.save(roomDTO);
            return ResponseEntity
                    .status(HttpStatus.CREATED) // sets actual 201 status
                    .body(new ResponseUtil(201, "Room Saved", savedRoom));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR) // sets actual 500 status
                    .body(new ResponseUtil(500, e.getMessage(), null));
        }
    }

    @GetMapping("getAll")
    public ResponseUtil getAllRooms(){

        List<RoomDTO> rooms = roomService.getAll();
        return new ResponseUtil(200, "Room details are retrieved", rooms);
    }

    @GetMapping("/roomTypesByHotel/{hotelId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseUtil getRoomTypesByHotel(@PathVariable UUID hotelId) {
        List<RoomDTO> roomTypes = roomService.getRoomTypesByHotel(hotelId);  // Directly pass the UUID
        if (roomTypes.isEmpty()) {
            return new ResponseUtil(404, "No room types found for the specified hotel", null);
        }
        return new ResponseUtil(200, "Room types retrieved successfully", roomTypes);
    }

    @PutMapping("update")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseUtil updateRoom(@RequestBody RoomDTO roomDTO){
        roomService.update(roomDTO);
        return new ResponseUtil(200, "Room is updated", null);
    }

    @DeleteMapping(path = "delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseUtil deleteRoom(@PathVariable(value = "id") String id){
        roomService.delete(id);
        return new ResponseUtil(200, "Room is deleted", null);
    }
}
