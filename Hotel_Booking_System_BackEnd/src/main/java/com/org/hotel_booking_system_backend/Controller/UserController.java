package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;
import com.org.hotel_booking_system_backend.Dto.UserDTO;
import com.org.hotel_booking_system_backend.Service.UserService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/user")
@CrossOrigin(origins = "http://localhost:63342")
public class UserController {
    private List<UserDTO> userDTOList;
    @Autowired
    private UserService userService;
    static Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping(path = "getAll", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getHotel() {
        List<UserDTO> allUsers = userService.getAllUsers();
        for (UserDTO hotelDTO : allUsers) {
            System.out.println("Room ID: " + hotelDTO.getUserId()); // ✅ Debugging
        }
        return new ResponseUtil(200, "Success", allUsers);
    }
    @GetMapping(value = "getAll/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO getSelectedUser(@PathVariable("userId") String userId){
        return userService.getSelectedUser(userId);
    }
    @GetMapping("/getAllUserIds")
    public ResponseEntity<List<String>> getAllUserIds() {
        return ResponseEntity.ok((List<String>) userService.getAllUserIds());
    }

    @PostMapping(path="save",consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> saveUser(@Valid @RequestBody UserDTO user){
        if(user == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }else {
            try{
                userService.save(user);
                logger.info("User saved :" + user);
                return new ResponseEntity<>(HttpStatus.CREATED);
            }catch (Exception e){
                logger.error(e.getMessage());
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
    }

}
