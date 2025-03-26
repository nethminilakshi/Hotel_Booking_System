package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.UserDTO;
import com.org.hotel_booking_system_backend.Entity.Room;
import com.org.hotel_booking_system_backend.Entity.User;
import com.org.hotel_booking_system_backend.Repo.UserRepo;
import com.org.hotel_booking_system_backend.Service.UserService;
import com.org.hotel_booking_system_backend.Util.AppUtil;
import com.org.hotel_booking_system_backend.Util.Mapping;
import com.org.hotel_booking_system_backend.Util.VarList;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class UserServiceImpl implements UserService, UserDetailsService {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private Mapping mapping;
    @Autowired
    private ModelMapper modelMapper;

    public UserServiceImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;

        // Define your mappings here
        modelMapper.addMappings(new PropertyMap<User, UserDTO>() {
            @Override
            protected void configure() {
                map().setUserId(source.getUserId());
            }
        });
    }


    @Override
    public List<UserDTO> getAllUsers() {
        List<User> getAllUsers = userRepo.findAll();
        return mapping.convertUserToDTOList(getAllUsers);
    }

    @Override
    public UserDTO getSelectedUser(String userId) {
        if (userRepo.existsById(userId)) {
            User userEntityByID = userRepo.getReferenceById(userId);
            return mapping.convertToUserDTO(userEntityByID);
        } else {
            throw new RuntimeException("User not Found");
        }
    }

    @Override
    public List<String> getAllUserIds() {
        return userRepo.findAllUserIds();

    }

    @Override
    public int save(UserDTO userDTO) {
        User user = mapping.convertToUserEntity(userDTO);

        if (user.getUserId() == null || user.getUserId().isEmpty()){
            user.setUserId(AppUtil.createUserCode());
        }
        if (userRepo.existsByEmail(userDTO.getEmail())) {
            System.out.println("Email Already Used");
            return VarList.Not_Acceptable;
        } else {
            System.out.println("Created");
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            userDTO.setRole("USER");
            userRepo.save(user);
            return VarList.Created;
        }
    }

    @Override
    public void deleteUser(String email) {
        if (userRepo.existsByEmail(email)) {
            userRepo.deleteByEmail(email);
        } else {
            throw new RuntimeException("User not Found");
        }
    }

    public UserDTO loadUserDetailsByUsername(String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),  getAuthority(user));
    }


    private Set<SimpleGrantedAuthority> getAuthority(User user) {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole()));
        return authorities;
    }


}


