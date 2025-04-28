package com.example.stayease.repositories;

import com.example.stayease.models.Address;
import com.example.stayease.models.Ads;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Ads, Integer> {


    @Query(value = "CALL sp_find_address_by_ad_id(:adId)", nativeQuery = true)
    Optional<Address> findAddressByAdId(@Param("adId") Integer adId);

    @Query(value = "CALL sp_save_address(:street, :city, :zipcode, :adId)", nativeQuery = true)
    Address saveAddress(@Param("street") String street,
                        @Param("city") String city,
                        @Param("zipcode") String zipcode,
                        @Param("adId") Integer adId);

    @Query(value = "CALL sp_delete_address_by_ad_id(:adId)", nativeQuery = true)
    @Transactional
    void deleteAddressByAdId(@Param("adId") Integer adId);



}
