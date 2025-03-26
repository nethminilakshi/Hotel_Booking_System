package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.AuthDTO;
import com.org.hotel_booking_system_backend.Dto.UserDTO;
import com.org.hotel_booking_system_backend.Service.Impl.UserServiceImpl;
import com.org.hotel_booking_system_backend.Service.UserService;
import com.org.hotel_booking_system_backend.Util.JwtUtil;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import com.org.hotel_booking_system_backend.Util.VarList;
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
public class AdminUserController {
    private List<UserDTO> userDTOList;
    private final JwtUtil jwtUtil;
    private final UserServiceImpl userServiceImpl;
    @Autowired
    private UserService userService;

    static Logger logger = LoggerFactory.getLogger(AdminUserController.class);

    public AdminUserController(UserService userService, JwtUtil jwtUtil, UserServiceImpl userServiceImpl) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.userServiceImpl = userServiceImpl;
    }
    @GetMapping(path = "getAll", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getHotel() {
        List<UserDTO> allUsers = userService.getAllUsers();
        for (UserDTO hotelDTO : allUsers) {
            System.out.println("Room ID: " + hotelDTO.getUserId()); // ✅ Debugging
        }
        return new ResponseUtil(200, "Success", allUsers);
    }


    @DeleteMapping("/delete/{email}")
    public ResponseEntity<ResponseUtil> deleteUser(@PathVariable("email") String email) {
        userService.deleteUser(email);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseUtil(200, "User Deleted Successfully", null));
    }

    @GetMapping(value = "getAll/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO getSelectedUser(@PathVariable("userId") String userId){
        return userService.getSelectedUser(userId);
    }
    @GetMapping("/getAllUserIds")
    public ResponseEntity<List<String>> getAllUserIds() {
        return ResponseEntity.ok((List<String>) userService.getAllUserIds());
    }

    @PostMapping(value = "/register")
    public ResponseEntity<ResponseUtil> registerUser(@RequestBody @Valid UserDTO userDTO) {
        try {
            int res = userService.save(userDTO);
            System.out.println(userDTO.getUsername() + " " + userDTO.getEmail() + " " + userDTO.getRole() + " " + userDTO.getPassword());
            switch (res) {
                case VarList.Created -> {
                    System.out.println("Created");
                    String token = jwtUtil.generateToken(userDTO);
                    AuthDTO authDTO = new AuthDTO();
                    authDTO.setEmail(userDTO.getEmail());
                    authDTO.setToken(token);
                    return ResponseEntity.status(HttpStatus.CREATED)
                            .body(new ResponseUtil(VarList.Created, "Success", authDTO));
                }
                case VarList.Not_Acceptable -> {
                    return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                            .body(new ResponseUtil(VarList.Not_Acceptable, "Email Already Used", null));
                }
                default -> {
                    return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                            .body(new ResponseUtil(VarList.Bad_Gateway, "Error", null));
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseUtil(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }
}
