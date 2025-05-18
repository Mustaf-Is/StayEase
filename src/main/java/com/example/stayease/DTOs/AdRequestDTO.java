package com.example.stayease.DTOs;

import com.example.stayease.models.Address;
import com.example.stayease.models.Ads;
import com.example.stayease.models.Image;

import java.util.List;

public record AdRequestDTO(
        Ads ad,
        Address address,
        List<String> imageUrls,
        Integer userId
) {
}
