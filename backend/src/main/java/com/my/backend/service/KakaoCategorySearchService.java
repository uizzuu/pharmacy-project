package com.my.backend.service;

import com.my.backend.dto.DocumentDto;
import com.my.backend.dto.KakaoApiResponseDto;
// import com.my.backend.dto.OutputDto; // OutputDto 관련 메서드를 제거했으므로 더 이상 필요하지 않을 수 있습니다.
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoCategorySearchService {
    private final RestTemplate restTemplate;

    @Value("${MY_KAKAO_KEY}")
    private String kakaoRestApiKey;

    private static final String KAKAO_CATEGORY_URL =
            "https://dapi.kakao.com/v2/local/search/category.json";

    public KakaoApiResponseDto resultCategorySearch(double latitude, double longitude, double radius) {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder
                .fromUriString(KAKAO_CATEGORY_URL);
        // 파라미터 설정
        uriBuilder.queryParam("category_group_code", "PM9");
        uriBuilder.queryParam("x", longitude);
        uriBuilder.queryParam("y", latitude);
        uriBuilder.queryParam("radius", radius);
        uriBuilder.queryParam("sort", "distance");

        URI uri = uriBuilder.build().encode().toUri();
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION,
                "KakaoAK " + kakaoRestApiKey);
        HttpEntity<Object> httpEntity = new HttpEntity<>(headers);

        return restTemplate.exchange(
                uri,
                HttpMethod.GET,
                httpEntity,
                KakaoApiResponseDto.class
        ).getBody();
    }

    /**
     * 약국 검색 결과를 DocumentDto 리스트로 반환 (PharmacyService에서 변환 및 저장 담당)
     */
    public List<DocumentDto> requestCategorySearchAndReturnDocuments(double latitude, double longitude, double radius) {
        KakaoApiResponseDto response = resultCategorySearch(latitude, longitude, radius);
        return response != null ? response.getDocumentList() : List.of();
    }

    // ⭐ makeOutputDto 메서드와 private convertDto 메서드를 제거했습니다.
    //    이 로직은 이제 PharmacyService.convertToOutputDtoAndSave에서 처리됩니다.
}