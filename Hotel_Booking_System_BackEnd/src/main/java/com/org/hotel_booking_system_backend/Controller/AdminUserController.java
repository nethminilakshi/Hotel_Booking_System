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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/user")
@CrossOrigin(origins = "http://localhost:63342")
public class AdminUserController {
    private List<UserDTO> userDTOList;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    static Logger logger = LoggerFactory.getLogger(AdminUserController.class);

    public AdminUserController(UserService userService, JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }
    @GetMapping(path = "getAll", produces = MediaType.APPLICATION_JSON_VALUE)
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseUtil getAllUsers() {
        List<UserDTO> allUsers = userService.getAllUsers();
        System.out.println(allUsers);
        for (UserDTO hotelDTO : allUsers) {
            System.out.println("User ID: " + hotelDTO.getUserId());
        }
        return new ResponseUtil(200, "Success", allUsers);
    }


    @DeleteMapping("delete/{email}")
//    @PreAuthorize("hasAuthority('ADMIN') or authentication.name == #email")
    public ResponseEntity<ResponseUtil> deleteUser(@PathVariable("email") String email) {
        try {
            System.out.println("Attempting to delete user: " + email + ", Authenticated user: " + SecurityContextHolder.getContext().getAuthentication().getName());
            int res = userService.deleteUserByEmail(email);
            if (res == VarList.OK) {
                return ResponseEntity.ok(new ResponseUtil(VarList.OK, "User deleted successfully", null));
            } else if (res == VarList.Forbidden) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ResponseUtil(VarList.Forbidden, "Cannot delete admin users unless by self", null));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseUtil(VarList.Not_Found, "User not found", null));
            }
        } catch (Exception e) {
            System.err.println("Error deleting user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseUtil(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }

    @GetMapping(value = "getAll/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO getSelectedUser(@PathVariable("userId") UUID userId){
        return userService.getSelectedUser(userId);
    }
//    @GetMapping("/getAllUserIds")
//    public ResponseEntity<List<String>> getAllUserIds() {
//        return ResponseEntity.ok((List<String>) userService.getAllUserIds());
//    }

    @PostMapping(value = "register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil registerUser(@RequestBody @Valid UserDTO userDTO) {
        try {
            System.out.println("Received user registration request: " + userDTO);

            int res = userService.saveUser(userDTO);
            switch (res) {
                case VarList.Created -> {
                    String token = jwtUtil.generateToken(userDTO);
                    AuthDTO authDTO = new AuthDTO(userDTO.getEmail(), token, userDTO.getRole());
                    return new ResponseUtil(VarList.Created, "Success", authDTO);
                }
                case VarList.Not_Acceptable -> {
                    return new ResponseUtil(VarList.Not_Acceptable, "Email Already Used", null);
                }
                default -> {
                    return new ResponseUtil(VarList.Bad_Gateway, "Error", null);
                }
            }
        } catch (Exception e) {
            e.printStackTrace(); // log the issue to console for debugging
            return new ResponseUtil(VarList.Internal_Server_Error, e.getMessage(), null);
        }
    }

    @GetMapping("/checkUser")
    public ResponseEntity<?> checkUserExists(@RequestParam("email") String email, @RequestParam("contact") String contact) {
        boolean exists = userService.existsByEmailAndContact(email, contact);
        return ResponseEntity.ok(new ResponseUtil(201, "Checked", exists));
    }

}
