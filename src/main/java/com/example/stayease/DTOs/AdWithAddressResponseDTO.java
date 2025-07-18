package com.example.stayease.DTOs;

import com.example.stayease.enums.AdsType;

import java.time.LocalDateTime;
import java.util.List;

public record AdWithAddressResponseDTO(
        Integer id,
        String title,
        String description,
        LocalDateTime pubDate,
        AdsType type,
        double pricePerDay,
        double pricePerWeek,
        double pricePerMonth,
        String street,
        String city,
        String zipcode,
        List<String> imageUrls,
        Integer userId
) {

}
