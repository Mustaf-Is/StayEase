package com.example.stayease.repositories;
import com.example.stayease.enums.AdsType;
import com.example.stayease.models.Ads;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AdRepository extends JpaRepository<Ads, Integer> {
    @Query(value = "CALL sp_find_all_ads()", nativeQuery = true)
    List<Ads> findAllAds();

    @Query(value = "CALL sp_find_all_ads_per_user(:id)", nativeQuery = true)
    List<Ads> findAllAdsPerUser(@Param("id") Integer id);

    @Query(value = "CALL sp_find_ad_by_id(:id)", nativeQuery = true)
    Optional<Ads> findAdById(@Param("id") Integer id);

    @Query(value = "CALL sp_save_ad(:title, :description, :pubDate, :type, :pricePerDay, :pricePerWeek, :pricePerMonth, :userId)", nativeQuery = true)
    Ads saveAd(@Param("title") String title,
               @Param("description") String description,
               @Param("pubDate") LocalDateTime pubDate,
               @Param("type") AdsType type,
               @Param("pricePerDay") double pricePerDay,
               @Param("pricePerWeek") double pricePerWeek,
               @Param("pricePerMonth") double pricePerMonth,
               @Param("userId") Integer userId);

    @Query(value = "CALL sp_update_ad(:#{#ad.id}, :#{#ad.title}, :#{#ad.description}, :#{#ad.pubDate}, :#{#ad.type}, :#{#ad.pricePerDay}, :#{#ad.pricePerWeek}, :#{#ad.pricePerMonth})", nativeQuery = true)
    Ads updateAd(@Param("ad") Ads ad);


    @Procedure("stayease.sp_delete_ad")
    @Transactional
    void deleteAdById(@Param("id") Integer id);

}
