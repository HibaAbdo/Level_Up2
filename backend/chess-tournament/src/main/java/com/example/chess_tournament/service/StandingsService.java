package com.example.chess_tournament.service;

import com.example.chess_tournament.dto.StandingDTO;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
public class StandingsService {

    /**
     * Reads a TRF file and extracts standings from each 001 line.
     */
    public List<StandingDTO> getStandings(String trfPath) {
        List<StandingDTO> standings = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(trfPath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.startsWith("001"))
                    continue;

                // Read relevant fields from fixed-width TRF format
                int playerId = Integer.parseInt(line.substring(3, 7).trim());
                String name = line.substring(12, 45).trim();

                // Score: columns 78–81
                double score = Double.parseDouble(line.substring(77, 81).trim());

                // Rank: columns 88–90
                int rank = Integer.parseInt(line.substring(87, 90).trim());

                standings.add(new StandingDTO(playerId, name, score, rank));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // final standings due to rank
        standings.sort(Comparator.comparingInt(StandingDTO::getRank));

        return standings;
    }
}
