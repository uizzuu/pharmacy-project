package com.my.backend.controller;

import com.my.backend.entity.Pharmacy;
import com.my.backend.service.PharmacyService;
import com.my.backend.dto.OutputDto;
import com.my.backend.dto.SearchRequestDto;

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
// ⭐ @CrossOrigin 제거 - CorsConfig에서 전역 설정으로 처리
public class PharmacyController {

    private final PharmacyService pharmacyService;

    /**
     * 주소 검색 및 약국 저장 (카카오 API 호출 및 DB 저장)
     */
    @PostMapping("/search")
    public ResponseEntity<List<OutputDto>> searchAndSave(@RequestBody SearchRequestDto request) {
        log.info("약국 검색 및 저장 요청: 주소={}", request.getAddress());
        List<OutputDto> results = pharmacyService.searchAndSavePharmacies(request.getAddress());
        return ResponseEntity.ok(results);
    }

    /**
     * 약국 등록 (개별 저장)
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
        return ResponseEntity.ok("OK");
    }
}