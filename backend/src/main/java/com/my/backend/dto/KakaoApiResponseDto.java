package com.my.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class KakaoApiResponseDto {
    @JsonProperty("documents")
    private List<DocumentDto> documentList;
    @JsonProperty("meta")
    private MetaDto metaDto;
}
