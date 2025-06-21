// package com.example.TournamentSetup.controllers;

// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/players") // العنوان الذي سيرد على الطلبات
// public class PlayerController {

// @GetMapping // هذا معناه طلب GET
// public List<String> getAllPlayers() {
// return List.of("Samira", "Lina", "Mariam");
// }

// // مثال لإضافة لاعب
// @PostMapping
// public String addPlayer(@RequestBody String name) {
// System.out.println("تم إضافة اللاعب: " + name);
// return "تمت الإضافة: " + name;
// }
// }

// not really needed but keeping it so if somewhre calling it can get it back
// fast