package backend.controller;

import backend.model.ConfigAgenda;
import backend.service.AgendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/instrutores/agenda")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService agendaService;

    @GetMapping("/{usuarioId}")
    public ResponseEntity<ConfigAgenda> obterAgenda(@PathVariable String usuarioId) {
        ConfigAgenda agenda = agendaService.buscarPorUsuario(usuarioId);
        if (agenda == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(agenda);
    }

    @PutMapping("/{usuarioId}")
    public ResponseEntity<ConfigAgenda> salvarAgenda(@PathVariable String usuarioId, @RequestBody ConfigAgenda agenda) {
        return ResponseEntity.ok(agendaService.salvarOuAtualizar(usuarioId, agenda));
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> deletarAgenda(@PathVariable String usuarioId) {
        agendaService.deletarAgenda(usuarioId);
        return ResponseEntity.noContent().build();
    }
}