package com.my.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// ⭐ 이 파일을 추가하면 @CrossOrigin의 컴파일 오류를 무시하고
//    가장 확실하게 CORS 403 에러를 해결할 수 있습니다.
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // '/api/'로 시작하는 모든 요청에 대해 CORS 허용
        registry.addMapping("/api/**")
                // ⭐ 모든 출처 허용. (http://localhost:3000, http://52.78.140.244 등)
                .allowedOrigins("*")
                // POST, GET, DELETE 등 모든 HTTP 메서드 허용
                .allowedMethods("GET", "POST", "DELETE", "OPTIONS")
                // 모든 헤더 허용
                .allowedHeaders("*")
                // 인증 정보 불필요 설정
                .allowCredentials(false)
                .maxAge(3600); // Preflight 요청 결과 캐싱 시간 (초)
    }
}