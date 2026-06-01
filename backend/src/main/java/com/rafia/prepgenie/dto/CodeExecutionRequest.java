package com.rafia.prepgenie.dto;

public class CodeExecutionRequest {
    private String language;
    private String code;

    public CodeExecutionRequest() {}

    public CodeExecutionRequest(String language, String code) {
        this.language = language;
        this.code = code;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
