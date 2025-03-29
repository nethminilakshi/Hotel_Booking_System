package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.UserDTO;
import com.org.hotel_booking_system_backend.Service.Impl.UserServiceImpl;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import com.org.hotel_booking_system_backend.Util.VarList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/admin")
@CrossOrigin(origins = "http://localhost:63342")
public class AdminController {
    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/adminCheck")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminCheck(){
      return  "Admin access passed!";    }

    @GetMapping("/userCheck")
    @PreAuthorize("hasRole('USER')")
    public String userCheck(){
        return "User access passed!";
    }

    @GetMapping("/managerCheck")
    @PreAuthorize("hasRole('MANAGER')")
    public String managerCheck(){
        return "Manager access passed!";
    }
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseUtil> getAllUsers() {
        try {
            System.out.println("Fetching all users for admin...");
            List<UserDTO> users = userService.getAllUsers();
            System.out.println("Users retrieved: " + users.size());
            return ResponseEntity.ok(new ResponseUtil(VarList.OK, "Users retrieved successfully", users));
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseUtil(VarList.Internal_Server_Error, "Error retrieving users: " + e.getMessage(), null));
        }
    }

}
