package com.example.chess_tournament.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.chess_tournament.model.Tournament;
import com.example.chess_tournament.repository.TournamentRepository;
import com.example.chess_tournament.dto.PairingDTO;

import java.io.*;
import java.util.*;

@Service
public class JaVaFoService {

    @Autowired
    private TournamentRepository tournamentRepository;

    private static final Map<String, String> TIEBREAKER_MAP = Map.of(
            "DirectEncounter", "1",
            "Buchholz", "2",
            "BuchholzCut1", "3",
            "BuchholzCut2", "4",
            "Berger", "5",
            "Cumulative", "6",
            "CumulativeOpponent", "7");

    private static final String DEFAULT_TIEBREAKERS = "1,3,2"; // DirectEncounter, BuchholzCut1, Buchholz

    public Tournament getTournamentById(Long id) {
        return tournamentRepository.findById(id).orElse(null);
    }

    public String runPairing(String trfFile, List<String> tieBreakers) {
        try {
            String tbArgument = (tieBreakers == null || tieBreakers.isEmpty())
                    ? DEFAULT_TIEBREAKERS
                    : mapTieBreakers(tieBreakers);

            if (!tbArgument.isEmpty()) {
                ensureTieBreakersInTrf(new File(trfFile), tbArgument);
            }

            List<String> command = new ArrayList<>(Arrays.asList(
                    "java", "-jar", "lib/javafo.jar",
                    "-o", trfFile,
                    trfFile));

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));

            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            process.waitFor();

            if (!tbArgument.isEmpty()) {
                ensureTieBreakersInTrf(new File(trfFile), tbArgument);
            }

            return "Pairing done.\n" + output;

        } catch (Exception e) {
            return "Failed to run JaVaFo: " + e.getMessage();
        }
    }

    private String mapTieBreakers(List<String> names) {
        List<String> codes = new ArrayList<>();
        for (String name : names) {
            for (Map.Entry<String, String> entry : TIEBREAKER_MAP.entrySet()) {
                if (entry.getKey().equalsIgnoreCase(name)) {
                    codes.add(entry.getValue());
                }
            }
        }
        return String.join(",", codes);
    }

    private void ensureTieBreakersInTrf(File trfFile, String tbArgument) throws IOException {
        List<String> lines = new ArrayList<>();
        boolean line132Found = false;

        try (BufferedReader reader = new BufferedReader(new FileReader(trfFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("132")) {
                    line = "132 -tiebreakers=" + tbArgument;
                    line132Found = true;
                }
                lines.add(line);
            }
        }

        if (!line132Found) {
            lines.add("132 -tiebreakers=" + tbArgument);
        }

        try (PrintWriter writer = new PrintWriter(new FileWriter(trfFile))) {
            for (String l : lines) {
                writer.println(l);
            }
        }
    }

    public List<PairingDTO> getCurrentPairings(String trfPath) {
        List<PairingDTO> pairings = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(trfPath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.startsWith("001"))
                    continue;

                int playerId = Integer.parseInt(line.substring(3, 7).trim());
                String playerName = line.substring(12, 45).trim();

                // Parse last opponent + color + result (assumed latest round)
                String[] tokens = line.trim().split("\\s+");
                if (tokens.length >= 4) {
                    String opponentStr = tokens[tokens.length - 3];
                    String color = tokens[tokens.length - 2];
                    String result = tokens[tokens.length - 1];

                    int opponentId = Integer.parseInt(opponentStr);

                    // Get opponent name
                    BufferedReader reader2 = new BufferedReader(new FileReader(trfPath));
                    String oppLine;
                    String opponentName = "";
                    while ((oppLine = reader2.readLine()) != null) {
                        if (oppLine.startsWith("001")) {
                            int pid = Integer.parseInt(oppLine.substring(3, 7).trim());
                            if (pid == opponentId) {
                                opponentName = oppLine.substring(12, 45).trim();
                                break;
                            }
                        }
                    }
                    reader2.close();

                    if (color.equalsIgnoreCase("w")) {
                        pairings.add(new PairingDTO(pairings.size() + 1, playerName, opponentName, result));
                    } else {
                        pairings.add(new PairingDTO(pairings.size() + 1, opponentName, playerName, result));
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return pairings;
    }

}
