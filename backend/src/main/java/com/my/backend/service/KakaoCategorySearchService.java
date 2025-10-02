package com.my.backend.service;

import com.my.backend.dto.DocumentDto;
import com.my.backend.dto.KakaoApiResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException; // API 클라이언트 에러(4xx) 처리를 위해 추가
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.util.CollectionUtils;

import java.net.URI;
import java.util.Collections; // Collections.emptyList() 사용을 위해 추가
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
        if(kakaoRestApiKey == null || kakaoRestApiKey.isEmpty()) {
            log.error("카카오 API 키가 설정되지 않았습니다.");
            return null;
        }

        UriComponentsBuilder uriBuilder = UriComponentsBuilder
                .fromUriString(KAKAO_CATEGORY_URL);

        // 파라미터 설정
        uriBuilder.queryParam("category_group_code", "PM9");
        uriBuilder.queryParam("x", longitude);
        uriBuilder.queryParam("y", latitude);
        uriBuilder.queryParam("radius", radius);
        uriBuilder.queryParam("sort", "distance");

        URI uri = uriBuilder.build().encode().toUri();
        log.info("Category Search URI: {}", uri); // 🛑 로그 추가

        // ⭐ 헤더 설정 수정: KA 헤더 단순화
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, "KakaoAK " + kakaoRestApiKey);
        headers.set("KA", "SDK/1.0.0"); // 표준 형식으로 단순화

        HttpEntity<Object> httpEntity = new HttpEntity<>(headers);

        try {
            return restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    httpEntity,
                    KakaoApiResponseDto.class
            ).getBody();
        } catch (HttpClientErrorException e) {
            // 4xx 에러 (401 Unauthorized, 400 Bad Request 등) 처리
            log.error("카카오 카테고리 API 호출 중 클라이언트 에러 발생 ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            return null;
        } catch (Exception e) {
            // 기타 네트워크/IO 에러 처리
            log.error("카카오 카테고리 API 호출 중 일반 에러 발생: {}", e.getMessage());
            return null;
        }
    }

    public List<DocumentDto> requestCategorySearchAndReturnDocuments(double latitude, double longitude, double radius) {
        KakaoApiResponseDto response = resultCategorySearch(latitude, longitude, radius);

        if (response == null || CollectionUtils.isEmpty(response.getDocumentList())) {
            return Collections.emptyList();
        }
        return response.getDocumentList();
    }
}