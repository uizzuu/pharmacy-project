package com.my.backend.controller;

import com.my.backend.entity.Pharmacy;
import com.my.backend.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacies")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.allowed-origins}")
public class PharmacyController {

    private final PharmacyService pharmacyService;

    /**
     * 약국 등록
     */
    @PostMapping
    public ResponseEntity<Pharmacy> createPharmacy(@RequestBody Pharmacy pharmacy) {
        log.info("약국 등록 요청: {}", pharmacy);
        Pharmacy saved = pharmacyService.savePharmacy(pharmacy);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * 모든 약국 조회
     */
    @GetMapping
    public ResponseEntity<List<Pharmacy>> getAllPharmacies() {
        log.info("모든 약국 조회 요청");
        List<Pharmacy> pharmacies = pharmacyService.getAllPharmacies();
        return ResponseEntity.ok(pharmacies);
    }

    /**
     * 특정 거리 이내 약국 조회
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<Pharmacy>> getNearbyPharmacies(@RequestParam Double distance) {
        log.info("거리 {}km 이내 약국 조회", distance);
        List<Pharmacy> pharmacies = pharmacyService.getPharmaciesWithinDistance(distance);
        return ResponseEntity.ok(pharmacies);
    }

    /**
     * 약국 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<Pharmacy> getPharmacy(@PathVariable Long id) {
        log.info("약국 상세 조회: ID={}", id);
        Pharmacy pharmacy = pharmacyService.getPharmacyById(id);
        return ResponseEntity.ok(pharmacy);
    }

    /**
     * 약국 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePharmacy(@PathVariable Long id) {
        log.info("약국 삭제 요청: ID={}", id);
        pharmacyService.deletePharmacy(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Health Check
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Pharmacy API is running!");
    }
}