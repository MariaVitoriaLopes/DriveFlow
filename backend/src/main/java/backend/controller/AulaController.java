package backend.controller;

import backend.model.Aula;
import backend.service.AulaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/aulas")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AulaController {

    private final AulaService aulaService;

    // Endpoint chamado quando o instrutor clica em qualquer dia do calendário do Angular

    @GetMapping("/instrutor/{instrutorId}/dia")
    public ResponseEntity<List<Aula>> obterAgendaDoDia(
            @PathVariable String instrutorId,
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(aulaService.buscarAgendaDoDia(instrutorId, data));
    }

    @PostMapping("/agendar")
    public ResponseEntity<Aula> criarAgendamento(@RequestBody Aula aula) {
        return ResponseEntity.ok(aulaService.agendarAula(aula));
    }

    @PutMapping("/{aulaId}/cancelar")
    public ResponseEntity<Aula> cancelar(@PathVariable String aulaId) {
        return ResponseEntity.ok(aulaService.cancelarAula(aulaId));
    }
}