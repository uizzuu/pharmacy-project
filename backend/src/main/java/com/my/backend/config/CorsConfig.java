package com.my.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // ⭐ EC2 퍼블릭 IP와 localhost 모두 허용
                .allowedOrigins(
                    "http://localhost:3000",
                    "http://52.78.140.244",
                    "http://52.78.140.244:8080" 
                )
                .allowedMethods("GET", "POST", "DELETE", "PUT", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}