package com.example.stayease.models;

import com.example.stayease.enums.AdsType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "ads")
public class Ads {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "title", nullable = false, unique = true)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "pub_date", nullable = false)
    private LocalDateTime pubDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private AdsType type;

    @Column(name = "price_per_day", nullable = false)
    private double pricePerDay;

    @Column(name = "price_per_week", nullable = false)
    private double pricePerWeek;

    @Column(name = "price_per_month", nullable = false)
    private double pricePerMonth;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "ad", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    @OneToOne(mappedBy = "ad", cascade = CascadeType.ALL)
    private Address address;

}
