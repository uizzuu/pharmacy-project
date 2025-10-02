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
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.HttpClientErrorException; // API 클라이언트 에러(4xx) 처리를 위해 추가

import java.net.URI;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoAddressSearchService {
    private final RestTemplate restTemplate;

    @Value("${MY_KAKAO_KEY}")
    private String kakaoRestApiKey;

    private static final String KAKAO_ADDRESS_SEARCH_URL =
            "https://dapi.kakao.com/v2/local/search/address.json";


    // 🛑 1. PharmacyService에서 호출하는 주소 검색 메서드 (누락된 메서드)
    public DocumentDto getAddressSearchResult(String address) {
        // requestAddressSearch에서 API 오류를 null로 처리하므로 안전하게 null 체크만 합니다.
        KakaoApiResponseDto kakaoApiResponseDto = requestAddressSearch(address);

        if (kakaoApiResponseDto == null || CollectionUtils.isEmpty(kakaoApiResponseDto.getDocumentList())) {
            log.warn("카카오 주소 검색 API 결과 없음 또는 오류 발생. 요청 주소: {}", address);
            return null; // 결과가 없거나 API 호출 중 에러 발생 시 null 반환
        }

        // 첫 번째 검색 결과(가장 정확한 결과)의 DocumentDto만 반환
        return kakaoApiResponseDto.getDocumentList().get(0);
    }


    // 🛑 2. 카카오 API에 실제 요청을 보내는 저수준 메서드 (401 및 500 에러 해결 포함)
    private KakaoApiResponseDto requestAddressSearch(String address) {
        if(address == null || kakaoRestApiKey == null || kakaoRestApiKey.isEmpty()) {
            log.error("주소 또는 카카오 API 키가 설정되지 않았습니다.");
            return null;
        }

        URI uri = UriComponentsBuilder
                .fromUriString(KAKAO_ADDRESS_SEARCH_URL)
                .queryParam("query", address)
                .build()
                .encode()
                .toUri();

        log.info("API Request URI: {}", uri);

        // 헤더 설정: Authorization 및 KA 헤더 설정 (401 에러 해결의 핵심)
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, "KakaoAK " + kakaoRestApiKey);
        headers.set("KA", "sdk/1.0 os/spring origin/http://localhost:8080"); // 서버 환경에서 요구하는 추가 헤더

        HttpEntity<Object> httpEntity = new HttpEntity<>(headers);

        try {
            // API 호출 및 응답
            return restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    httpEntity,
                    KakaoApiResponseDto.class
            ).getBody();
        } catch (HttpClientErrorException e) {
            // 4xx 에러 (401 Unauthorized, 400 Bad Request 등) 발생 시
            log.error("카카오 API 호출 중 클라이언트 에러 발생 ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            return null; // 예외를 잡고 null 반환하여 500 에러 전파 방지
        } catch (Exception e) {
            // 기타 네트워크/IO 에러 처리
            log.error("카카오 API 호출 중 일반 에러 발생: {}", e.getMessage());
            return null; 
        }
    }
}