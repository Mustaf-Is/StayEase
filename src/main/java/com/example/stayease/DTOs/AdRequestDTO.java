package com.example.stayease.DTOs;

import com.example.stayease.models.Address;
import com.example.stayease.models.Ads;

public record AdRequestDTO(
        Ads ad,
        Address address,
        Integer userId
) {
}
