package com.my.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    /**
     * 외부 API 호출을 위한 RestTemplate Bean을 등록합니다.
     * KakaoAddressSearchService와 같은 서비스에서 DI를 통해 사용할 수 있게 합니다.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}