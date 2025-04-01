package com.org.hotel_booking_system_backend.Config;

import com.org.hotel_booking_system_backend.Service.Impl.UserServiceImpl;
import com.org.hotel_booking_system_backend.Util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author udarasan
 * @TimeStamp 2023-07-15 15:00
 * @ProjectDetails invoice_service
 */
@Component
public class JwtFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserServiceImpl userService;

    @Value("${jwt.secret}")
    private String secretKey;

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        try {
            String authorization = httpServletRequest.getHeader("Authorization");
            logger.debug("Authorization Header: {}", authorization);

            // If no Authorization header or not a Bearer token, just continue the filter chain
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                logger.debug("No valid Authorization header found, continuing filter chain");
                filterChain.doFilter(httpServletRequest, httpServletResponse);
                return;
            }

            String token = authorization.substring(7);

            // Handle empty token
            if (token.trim().isEmpty()) {
                logger.debug("Empty token received, continuing filter chain");
                filterChain.doFilter(httpServletRequest, httpServletResponse);
                return;
            }

            try {
                // Try to extract username and claims
                String email = jwtUtil.getUsernameFromToken(token);
                Claims claims = jwtUtil.getUserRoleCodeFromToken(token);

                // Set attributes if extraction successful
                httpServletRequest.setAttribute("email", email);
                httpServletRequest.setAttribute("role", claims.get("role"));

                // Authenticate user if not already authenticated
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userService.loadUserByUsername(email);

                    if (jwtUtil.validateToken(token, userDetails)) {
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.debug("User authenticated: {}", email);
                    }
                }
            } catch (MalformedJwtException e) {
                logger.error("JWT token is malformed: {}", e.getMessage());
            } catch (ExpiredJwtException e) {
                logger.error("JWT token is expired: {}", e.getMessage());
            } catch (UnsupportedJwtException e) {
                logger.error("JWT token is unsupported: {}", e.getMessage());
            } catch (SignatureException e) {
                logger.error("JWT signature validation failed: {}", e.getMessage());
            } catch (Exception e) {
                logger.error("Error processing JWT token: {}", e.getMessage());
            }
        } catch (Exception e) {
            logger.error("Error in JWT filter: {}", e.getMessage());
        }

        // Always continue the filter chain
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }
}