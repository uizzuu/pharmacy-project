package com.my.backend.repository;

import com.my.backend.entity.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

    // 거리 기준으로 정렬하여 조회
    List<Pharmacy> findAllByOrderByDistanceAsc();

    // 특정 거리 이내의 약국 조회
    List<Pharmacy> findByDistanceLessThanOrderByDistanceAsc(Double distance);
}