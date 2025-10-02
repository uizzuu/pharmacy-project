package com.my.backend.service;

import com.my.backend.dto.KakaoApiResponseDto;
import com.my.backend.dto.DocumentDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoAddressSearchService {
    private final RestTemplate restTemplate;

    // 환경변수에서 ${KAKAO_REST_API_KEY} 값을 가져와서 사용
    @Value("${MY_KAKAO_KEY}")
    private String kakaoRestApiKey;

    public void apikeyTest() {
        log.info("====== Kakao API Key : {}", kakaoRestApiKey);
    }

    // 우리가 만들 주소(url)
    // https://dapi.kakao.com/v2/local/search/address.json?query=강남대로 405
    private static final String KAKAO_LOCAL_URL =
            "https://dapi.kakao.com/v2/local/search/address.json";

    public KakaoApiResponseDto requestAddressSearch(String address) {
        // 건네받은 주소가 비어있는 경우
        if (ObjectUtils.isEmpty(address)) return null;
        // URL 만들기
        UriComponentsBuilder uriBuilder = UriComponentsBuilder
                .fromUriString(KAKAO_LOCAL_URL);
        uriBuilder.queryParam("query", address);

        // 해석 불가능한 UTF-8 -> 인코딩
        URI uri = uriBuilder.build().encode().toUri();

        log.info("address : {}, uri : {}", address, uri);

        // 🛑 수정된 부분: HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        // Kakao Developer 문서에 따라 'Authorization: KakaoAK {REST_API_KEY}' 형식으로 헤더를 설정합니다.
        headers.set(HttpHeaders.AUTHORIZATION, "KakaoAK " + kakaoRestApiKey);
        
        // 만약 여전히 401 에러가 발생한다면, 아래 KA 헤더를 추가해 보세요.
        // headers.set("KA", "SDK/1.0.0"); 

        HttpEntity<Object> httpEntity = new HttpEntity<>(headers);

        // API 호출 및 응답
        return restTemplate.exchange(
                uri,
                HttpMethod.GET,
                httpEntity,
                KakaoApiResponseDto.class
        ).getBody();
    }

    // [추가할 코드]

    // API 응답에서 가장 정확한 첫 번째 DocumentDto(좌표)를 반환하는 헬퍼 메서드
    public DocumentDto getAddressSearchResult(String address) {
        KakaoApiResponseDto kakaoApiResponseDto = requestAddressSearch(address);

        if (kakaoApiResponseDto == null || kakaoApiResponseDto.getDocumentList().isEmpty()) {
            return null;
        }

        return kakaoApiResponseDto.getDocumentList().get(0);
    }
}
