package com.example.stayease.mappers;

import com.example.stayease.DTOs.CreateUserDTO;
import com.example.stayease.models.User;

public class UserMapper {

    public static User toCreateEntity(CreateUserDTO dto) {
        User user = new User();

        user.setFullName(dto.fullName());
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.setRole(dto.role());


        return user;
    }
}
