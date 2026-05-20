package backend.controller;

import backend.model.Aula;
import backend.service.AulaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/aulas")
@CrossOrigin(origins = "http://localhost:4200")
public class AulaController {

    @Autowired
    private AulaService aulaService;

    // Rota para criar/agendar uma aula
    @PostMapping("/agendar")
    public ResponseEntity<Aula> agendar(@RequestBody Aula aula) {
        return ResponseEntity.ok(aulaService.agendarAula(aula));
    }

    // Rota para buscar as aulas de um instrutor específico
    @GetMapping("/instrutor/{id}")
    public ResponseEntity<List<Aula>> listarPorInstrutor(@PathVariable String id) {
        return ResponseEntity.ok(aulaService.listarPorInstrutor(id));
    }

    // Rota para buscar as aulas de um aluno específico
    @GetMapping("/aluno/{id}")
    public ResponseEntity<List<Aula>> listarPorAluno(@PathVariable String id) {
        return ResponseEntity.ok(aulaService.listarPorAluno(id));
    }
}