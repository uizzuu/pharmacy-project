package com.my.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class MetaDto {
    @JsonProperty("total_count")
    private Integer totalCount;
}
