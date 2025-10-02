package com.my.backend.repository;

import com.my.backend.entity.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

    // 거리 기준으로 정렬하여 조회 (findAllByOrderByDistanceAsc는 동적 검색 필드가 아님)
    // 실제 검색 로직은 PharmacyService에서 구현하며, 여기서는 기본 CRUD만 사용하거나
    // 필요시 좌표 기반 검색을 위한 커스텀 쿼리를 추가합니다.
    List<Pharmacy> findAll();

    // 중복 방지를 위한 조회
    Optional<Pharmacy> findByNameAndAddress(String name, String address);

    Optional<Pharmacy> findByName(String placeName);
}