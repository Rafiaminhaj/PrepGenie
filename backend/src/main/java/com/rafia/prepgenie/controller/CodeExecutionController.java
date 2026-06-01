package com.rafia.prepgenie.controller;

import com.rafia.prepgenie.dto.CodeExecutionRequest;
import com.rafia.prepgenie.dto.CodeExecutionResponse;
import com.rafia.prepgenie.service.CodeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute")
public class CodeExecutionController {

    @Autowired
    private CodeExecutionService executionService;

    @PostMapping
    public ResponseEntity<CodeExecutionResponse> executeCode(@RequestBody CodeExecutionRequest request) {
        CodeExecutionResponse response = executionService.executeCode(request);
        return ResponseEntity.ok(response);
    }
}
