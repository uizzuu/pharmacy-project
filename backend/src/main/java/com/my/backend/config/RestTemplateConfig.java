package com.my.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration // ⭐ 이 클래스를 설정 파일로 지정합니다.
public class RestTemplateConfig {

    @Bean // ⭐ 이 메서드의 반환 객체를 스프링 Bean으로 등록합니다.
    public RestTemplate restTemplate() {
        // 실제 API 호출에 사용될 객체 생성
        return new RestTemplate();
    }
}