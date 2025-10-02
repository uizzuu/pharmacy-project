package com.my.backend.service;

import com.my.backend.dto.DocumentDto;
import com.my.backend.dto.OutputDto;
import com.my.backend.entity.Pharmacy;
import com.my.backend.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PharmacyService {

    private final PharmacyRepository pharmacyRepository;
    private final KakaoAddressSearchService kakaoAddressSearchService;
    private final KakaoCategorySearchService kakaoCategorySearchService;

    // 카카오 API를 통해 약국을 검색하고, DB에 저장한 후, OutputDto로 가공하여 반환하는 메서드
    @Transactional
    public List<OutputDto> searchAndSavePharmacies(String address) {
        // 1. 주소로 좌표 변환
        DocumentDto addressDocument = kakaoAddressSearchService.getAddressSearchResult(address);

        if (addressDocument == null) {
            log.error("주소 검색 결과 없음: {}", address);
            return List.of();
        }

        // 2. 좌표를 기준으로 카테고리 검색 (약국)
        double radius = 1000; // 1km 반경
        List<DocumentDto> pharmacyDocuments = kakaoCategorySearchService
                .requestCategorySearchAndReturnDocuments(
                        addressDocument.getLatitude(),
                        addressDocument.getLongitude(),
                        radius);

        // 3. DocumentDto 리스트를 OutputDto로 변환하고, DB에 저장 (3개만 처리)
        return pharmacyDocuments.stream()
                .limit(3)
                .map(this::convertToOutputDtoAndSave) // 변환 및 저장 로직 포함
                .collect(Collectors.toList());
    }

    // DocumentDto를 OutputDto로 변환하고, Pharmacy DB에 저장하는 통합 메서드
    private OutputDto convertToOutputDtoAndSave(DocumentDto documentDto) {
        // 1. DB에 저장할 Pharmacy 객체 생성 및 저장/업데이트
        Optional<Pharmacy> existingPharmacy = pharmacyRepository.findByName(documentDto.getPlaceName());

        Pharmacy pharmacy = Pharmacy.builder()
                .name(documentDto.getPlaceName())
                .address(documentDto.getAddressName())
                .distance(documentDto.getDistance())
                // ⭐ 좌표 저장
                .latitude(documentDto.getLatitude())
                .longitude(documentDto.getLongitude())
                .build();

        if (existingPharmacy.isPresent()) {
            pharmacy = existingPharmacy.get();
            // 동적으로 변하는 distance 값 업데이트
            pharmacy.setDistance(documentDto.getDistance());
            log.info("기존 약국 정보 사용 및 거리 업데이트: {}", pharmacy.getName());
        }

        // DB 저장 (새로 찾은 약국이거나, 기존 약국의 거리 업데이트)
        pharmacyRepository.save(pharmacy);
        log.info("약국 DB 저장/업데이트 완료: {}", pharmacy.getName());

        // 2. OutputDto로 변환 (URL 생성 및 좌표 포함)
        String ROAD_VIEW_URL = "https://map.kakao.com/link/roadview/";
        String DIRECTION_URL = "https://map.kakao.com/link/to/";

        String mapUrlParams = String.join(",",
                documentDto.getPlaceName(),
                String.valueOf(documentDto.getLatitude()),
                String.valueOf(documentDto.getLongitude()));

        String mapUrl = DIRECTION_URL + mapUrlParams;
        String roadUrl = ROAD_VIEW_URL + documentDto.getLatitude() + "," + documentDto.getLongitude();

        return OutputDto.builder()
                .pharmacyName(documentDto.getPlaceName())
                .pharmacyAddress(documentDto.getAddressName())
                .directionURL(mapUrl)
                .roadViewURL(roadUrl)
                .distance(String.format("%.2f m", documentDto.getDistance()))
                // ⭐ 추가: DocumentDto의 좌표를 OutputDto에 설정
                .latitude(documentDto.getLatitude())
                .longitude(documentDto.getLongitude())
                .build();
    }

    // --- CRUD 및 조회 로직 (Controller에서 사용) ---

    // 개별 약국 저장 (프론트에서 개별 저장 버튼 클릭 시)
    @Transactional
    public Pharmacy savePharmacy(Pharmacy pharmacy) {
        log.info("약국 저장: {}", pharmacy.getName());
        // 개별 저장 시에는 이미 좌표가 프론트에서 넘어온 것으로 가정
        return pharmacyRepository.save(pharmacy);
    }

    @Transactional(readOnly = true)
    public List<Pharmacy> getAllPharmacies() {
        // 필요에 따라 거리 순 정렬을 구현하거나 findAll()을 사용합니다.
        return pharmacyRepository.findAll();
    }

    @Transactional
    public void deletePharmacy(Long id) {
        pharmacyRepository.deleteById(id);
        log.info("약국 삭제 완료: ID={}", id);
    }
}