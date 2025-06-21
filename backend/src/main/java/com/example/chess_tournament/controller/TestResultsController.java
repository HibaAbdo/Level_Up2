package com.example.chess_tournament.controller;

import com.example.chess_tournament.results.GenerateRandomResultsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestResultsController {

    private final GenerateRandomResultsService generator;

    public TestResultsController(GenerateRandomResultsService generator) {
        this.generator = generator;
    }

    @GetMapping("/generate-random-results")
    public String generateResults(
            @RequestParam String trfFile,
            @RequestParam(defaultValue = "results.json") String outputJson) {
        return generator.generate(trfFile, outputJson);
    }
}
