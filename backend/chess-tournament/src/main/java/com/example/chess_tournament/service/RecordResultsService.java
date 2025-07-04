package com.example.chess_tournament.service;

import com.example.chess_tournament.dto.MatchInfo;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
public class RecordResultsService {

    public Map<String, Object> updateTrfFromResults(List<MatchInfo> matches, String trfPath) {
        Map<String, Object> response = new HashMap<>();

        // map that joins between player and info that need to be added to his line
        Map<Integer, List<String>> additions = new HashMap<>();

        // for each player, record result and opponent
        for (MatchInfo match : matches) {
            // white player
            additions.computeIfAbsent(match.whiteId, k -> new ArrayList<>())
                    .add(String.format(" %4d w %s", match.blackId, match.result));

            // black player
            additions.computeIfAbsent(match.blackId, k -> new ArrayList<>())
                    .add(String.format(" %4d b %s", match.whiteId, reverseResult(match.result)));
        }

        File inputFile = new File(trfPath);
        File tempFile = new File(trfPath + ".tmp");

        try (
                BufferedReader reader = new BufferedReader(new FileReader(inputFile));
                PrintWriter writer = new PrintWriter(new FileWriter(tempFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                // if line does not belong to player just copy it
                if (!line.startsWith("001")) {
                    writer.println(line);
                    continue;
                }

                int playerId = Integer.parseInt(line.substring(3, 7).trim());

                // build new line starting from previous one
                StringBuilder newLine = new StringBuilder(line);

                // add results for participated players
                if (additions.containsKey(playerId)) {
                    for (String extra : additions.get(playerId)) {
                        newLine.append(extra); // opponentId + color + result
                    }
                }

                // add the new line to the file
                writer.println(newLine.toString());
            }

        } catch (IOException e) {
            response.put("status", "error");
            response.put("message", "Failed to update TRF");
            response.put("details", e.getMessage());
            return response;
        }

        // delete previous file and assign the new one
        if (!inputFile.delete()) {
            response.put("status", "error");
            response.put("message", "Failed to delete original file.");
            return response;
        }
        if (!tempFile.renameTo(inputFile)) {
            response.put("status", "error");
            response.put("message", "Failed to rename temp file.");
            return response;
        }

        response.put("status", "success");
        response.put("message", "Results recorded successfully.");
        return response;
    }

    private String reverseResult(String result) {
        return switch (result) {
            case "1" -> "0";
            case "0" -> "1";
            case "=" -> "=";
            default -> "0"; // if result unknown, assign to loss
        };
    }
}
