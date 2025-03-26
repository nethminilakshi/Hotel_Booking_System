package com.org.hotel_booking_system_backend.Config;

import com.org.hotel_booking_system_backend.Service.Impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {
    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private JwtFilter jwtFilter;
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService).passwordEncoder(passwordEncoder());
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/v1/auth/authenticate",
                                "/api/v1/user/register",
                                "/api/v1/auth/refreshToken",
                                "/api/v1/user/delete/{id}",
                                "/api/v1/user/update/{id}",
                                "/api/v1/user/getAll",
                                "/api/v1/hotel/save",
                                "/api/v1/hotel/delete/{id}",
                                "/api/v1/hotel/update/{id}",
                                "/api/v1/hotel/getAll",
                                "/api/v1/room/save",
                                "/api/v1/room/delete/{id}",
                                "/api/v1/room/update/{id}",
                                "/api/v1/room/getAll",
                                "/api/v1/review/save",
                                "/api/v1/review/delete/{id}",
                                "/api/v1/review/update/{id}",
                                "/api/v1/review/getAll",
                                "/api/v1/booking/save",
                                "/api/v1/booking/delete/{id}",
                                "/api/v1/booking/update/{id}",
                                "/api/v1/booking/getAll",
                                "/api/v1/payment/save",
                                "/api/v1/payment/delete/{id}",
                                "/api/v1/payment/update/{id}",
                                "/api/v1/payment/getAll",
                                "/api/v1/hotelManager/getAll",
                                "/api/v1/ManagerRoom/getAllRoomByHotelID",
                                "/api/v1/ManagerBooking/getAllHotelBookings",
                                "/api/v1/ManagerPayment/getAllPaymentsByHotel",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }


}
