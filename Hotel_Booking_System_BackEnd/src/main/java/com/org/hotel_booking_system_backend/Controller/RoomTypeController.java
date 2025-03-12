package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;
import com.org.hotel_booking_system_backend.Service.RoomTypeService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/v1/roomType")
@CrossOrigin
public class RoomTypeController {
    private List<RoomTypeDTO> roomTypeDTOList;
    @Autowired
   private RoomTypeService roomTypeService;

    @PostMapping(path = "save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseUtil saveRoomType(@ModelAttribute RoomTypeDTO roomTypeDTO) throws IOException {
        roomTypeService.save(roomTypeDTO);

        // Return the result from the service layer
        return new ResponseUtil(201,"data saved",null);
    }

    @GetMapping(path = "getAll")
    public ResponseUtil getRoomTypes(){
        return new ResponseUtil(200, "Success",roomTypeService.getAll());

    }
    @PutMapping("update")
    public ResponseUtil updateRoomType(@ModelAttribute RoomTypeDTO roomTypeDTO){
        roomTypeService.update(roomTypeDTO);
        return new ResponseUtil(200, "Room Type is updated", null);

    }
    @DeleteMapping("delete/{id}")
    public ResponseUtil deleteRoomType(@PathVariable(value = "id") int id){
        roomTypeService.delete(id);
        return new ResponseUtil(200, "Room Type is deleted", null);
    }
}
