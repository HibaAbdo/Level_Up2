package com.example.chess_tournament.utils;

import com.example.chess_tournament.model.Organizer;
import com.example.chess_tournament.model.Player;
import com.example.chess_tournament.model.Tournament;

import java.io.*;
import java.util.*;

public abstract class TournamentToTRF {

    public static String convertToTRF(Tournament tournament, String frameFile) {
        List<String> frameLines = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(frameFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                frameLines.add(line);
            }
        } catch (IOException e) {
            return "Failed to read frame: " + e.getMessage();
        }

        List<String> outputLines = new ArrayList<>(frameLines);

        // Step 1: Adjust number of 001 lines
        int currentCount = 0;
        List<Integer> playerLineIndexes = new ArrayList<>();
        for (int i = 0; i < outputLines.size(); i++) {
            if (outputLines.get(i).startsWith("001")) {
                playerLineIndexes.add(i);
                currentCount++;
            }
        }

        List<Player> players = new ArrayList<>(tournament.getPlayers());
        if (players.size() > currentCount) {
            String lastLine = outputLines.get(playerLineIndexes.get(currentCount - 1));
            for (int i = 0; i < players.size() - currentCount; i++) {
                outputLines.add(lastLine);
            }
        } else if (players.size() < currentCount) {
            for (int i = currentCount - 1; i >= players.size(); i--) {
                outputLines.remove((int) playerLineIndexes.get(i));
            }
        }

        // Step 2: Replace header info
        replaceField(outputLines, "012", "012 XX " + tournament.getName());
        replaceField(outputLines, "042", "042 " + tournament.getStartDate());
        replaceField(outputLines, "052", "052 " + tournament.getEndDate());
        replaceField(outputLines, "062", "062 " + players.size());
        replaceField(outputLines, "092", "092 " + tournament.getType());

        Organizer organizer = tournament.getOrganizer();
        if (organizer != null) {
            String organizerLine = String.format("102 %s %s (%d)",
                    organizer.getTitle(),
                    organizer.getName(),
                    organizer.getFideId());
            replaceField(outputLines, "102", organizerLine);
        }

        replaceField(outputLines, "XXR", "XXR " + tournament.getRounds());

        // Step 3: Replace player lines
        int pIdx = 0;
        for (int i = 0; i < outputLines.size(); i++) {
            if (outputLines.get(i).startsWith("001") && pIdx < players.size()) {
                Player p = players.get(pIdx);
                String updated = formatPlayerLine(p);
                outputLines.set(i, updated);
                pIdx++;
            }
        }

        try {
            String outputDir = "output";
            String fileName = "report.trf";
            File dir = new File(outputDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            File outputFile = new File(dir, fileName);
            try (PrintWriter writer = new PrintWriter(new FileWriter(outputFile))) {
                for (String line : outputLines) {
                    writer.println(line);
                }
            }
            return outputFile.getAbsolutePath();
        } catch (IOException e) {
            return "Failed to write TRF file: " + e.getMessage();
        }
    }

    private static void replaceField(List<String> lines, String prefix, String newLine) {
        for (int i = 0; i < lines.size(); i++) {
            if (lines.get(i).startsWith(prefix)) {
                lines.set(i, newLine);
                break;
            }
        }
    }

    private static String formatPlayerLine(Player p) {
        return String.format(
                Locale.US,
                "001%4d %-5s %-33s %-3s %5d %4d %4.1f %3d",
                p.getId(),
                p.getGender(),
                p.getName(),
                p.getCountry(),
                p.getRating(),
                p.getBirthYear(),
                (float) p.getExtraPoints(), // use extra points as the "score"
                p.getKFactor());
    }
}
