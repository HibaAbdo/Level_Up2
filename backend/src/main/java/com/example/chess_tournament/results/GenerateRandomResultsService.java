package com.example.chess_tournament.results;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
public class GenerateRandomResultsService {

    public static class GameResult {
        public String white;
        public String black;
        public String result;

        public GameResult(String white, String black, String result) {
            this.white = white;
            this.black = black;
            this.result = result;
        }
    }

    public String generate(String trfFile, String outputJsonFile) {
        Map<Integer, String> players = new HashMap<>();
        List<String> lines = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(trfFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("001")) {
                    lines.add(line);
                    int id = Integer.parseInt(line.substring(4, 8).trim());
                    String name = line.substring(12, 46).trim();
                    players.put(id, name);
                }
            }
        } catch (IOException e) {
            return "❌ Failed to read TRF: " + e.getMessage();
        }

        Set<Integer> paired = new HashSet<>();
        List<GameResult> results = new ArrayList<>();
        Random random = new Random();

        for (String line : lines) {
            int id = Integer.parseInt(line.substring(4, 8).trim());
            if (paired.contains(id))
                continue;

            String[] parts = line.trim().split(" +");
            if (parts.length < 3)
                continue;

            String oppStr = parts[parts.length - 2];
            String colorStr = parts[parts.length - 1];

            int oppId;
            try {
                oppId = Integer.parseInt(oppStr);
            } catch (Exception e) {
                continue;
            }

            if (!players.containsKey(oppId) || paired.contains(oppId))
                continue;

            String white, black;
            if (colorStr.equalsIgnoreCase("w")) {
                white = players.get(id);
                black = players.get(oppId);
            } else {
                white = players.get(oppId);
                black = players.get(id);
            }

            String result = switch (random.nextInt(3)) {
                case 0 -> "1";
                case 1 -> "0";
                default -> "=";
            };

            results.add(new GameResult(white, black, result));
            paired.add(id);
            paired.add(oppId);
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File(outputJsonFile), results);
            return "✅ Random results written to " + outputJsonFile;
        } catch (IOException e) {
            return "❌ Failed to write JSON: " + e.getMessage();
        }
    }
}
