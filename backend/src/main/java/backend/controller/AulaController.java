package backend.controller;

import backend.dto.DisponibilidadeDiaResponseDTO;
import backend.dto.AulaAgendaDTO;
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

    @GetMapping("/instrutor/{instrutorId}/dia")
    public ResponseEntity<List<Aula>> obterAgendaDoDia(
            @PathVariable String instrutorId,
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(aulaService.buscarAgendaDoDia(instrutorId, data));
    }

    //  Endpoint para o Angular listar os slots dinâmicos no seletor de horários do Aluno
    @GetMapping("/disponiveis")
    public ResponseEntity<DisponibilidadeDiaResponseDTO> obterHorariosDisponiveis(
            @RequestParam String instrutorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(aulaService.consultarHorariosDisponiveis(instrutorId, data));
    }

    @PostMapping("/agendar")
    public ResponseEntity<Aula> criarAgendamento(@RequestBody Aula aula) {
        return ResponseEntity.ok(aulaService.agendarAula(aula));
    }

    @PutMapping("/{aulaId}/cancelar")
    public ResponseEntity<Aula> cancelar(@PathVariable String aulaId) {
        return ResponseEntity.ok(aulaService.cancelarAula(aulaId));
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<AulaAgendaDTO>> listarAulasDoAluno(@PathVariable String alunoId) {
        return ResponseEntity.ok(aulaService.listarAulasDoAluno(alunoId));
    }

    @GetMapping("/instrutor/{instrutorId}")
    public ResponseEntity<List<AulaAgendaDTO>> listarAulasDoInstrutor(@PathVariable String instrutorId) {
        return ResponseEntity.ok(aulaService.listarAulasDoInstrutor(instrutorId));
    }
}