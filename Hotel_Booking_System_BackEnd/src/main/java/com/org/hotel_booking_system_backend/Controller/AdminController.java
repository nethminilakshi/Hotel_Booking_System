package com.org.hotel_booking_system_backend.Controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/admin")
public class AdminController {
    @GetMapping("/adminCheck")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String adminCheck(){
      return  "Admin access passed!";    }

    @GetMapping("/userCheck")
    @PreAuthorize("hasAuthority('USER')")
    public String userCheck(){
        return "User access passed!";
    }

    @GetMapping("/managerCheck")
    @PreAuthorize("hasAuthority('MANAGER')")
    public String managerCheck(){
        return "Manager access passed!";
    }
}
