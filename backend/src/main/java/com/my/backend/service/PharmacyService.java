package com.my.backend.service;

import com.my.backend.entity.Pharmacy;
import com.my.backend.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PharmacyService {

    private final PharmacyRepository pharmacyRepository;

    /**
     * 약국 저장
     */
    @Transactional
    public Pharmacy savePharmacy(Pharmacy pharmacy) {
        log.info("약국 저장: {}", pharmacy.getName());
        return pharmacyRepository.save(pharmacy);
    }

    /**
     * 모든 약국 조회 (거리순 정렬)
     */
    @Transactional(readOnly = true)
    public List<Pharmacy> getAllPharmacies() {
        return pharmacyRepository.findAllByOrderByDistanceAsc();
    }

    /**
     * 특정 거리 이내 약국 조회
     */
    @Transactional(readOnly = true)
    public List<Pharmacy> getPharmaciesWithinDistance(Double distance) {
        return pharmacyRepository.findByDistanceLessThanOrderByDistanceAsc(distance);
    }

    /**
     * 약국 ID로 조회
     */
    @Transactional(readOnly = true)
    public Pharmacy getPharmacyById(Long id) {
        return pharmacyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("약국을 찾을 수 없습니다. ID: " + id));
    }

    /**
     * 약국 삭제
     */
    @Transactional
    public void deletePharmacy(Long id) {
        log.info("약국 삭제: ID={}", id);
        pharmacyRepository.deleteById(id);
    }
}