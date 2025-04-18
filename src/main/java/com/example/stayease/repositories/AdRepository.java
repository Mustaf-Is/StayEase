package com.example.stayease.repositories;
import com.example.stayease.enums.AdsType;
import com.example.stayease.models.Ads;
import com.example.stayease.models.User;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AdRepository extends JpaRepository<Ads, Integer> {
    @Query(value = "CALL sp_find_all_ads()", nativeQuery = true)
    List<Ads> findAllAds();

    @Query(value = "CALL sp_find_ad_by_id(:id)", nativeQuery = true)
    Optional<Ads> findAdById(@Param("id") Integer id);

    @Query(value = "CALL sp_save_ad(:title, :description, :pubDate, :type, :price, :userId)", nativeQuery = true)
    Ads saveAd(@Param("title") String title,
               @Param("description") String description,
               @Param("pubDate") LocalDateTime pubDate,
               @Param("type") AdsType type,
               @Param("price") double price,
               @Param("userId") Integer userId);

    @Query(value = "CALL sp_update_ad(:#{#ad.id}, :#{#ad.title}, :#{#ad.description}, :#{#ad.pubDate}, :#{#ad.type}, :#{#ad.price})", nativeQuery = true)
    Ads updateAd(@Param("ad") Ads ad);

    @Modifying
    @Query(value = "CALL sp_delete_ad(:id)", nativeQuery = true)
    void deleteAdById(@Param("id") Integer id);
}
