package backend.controller;

import backend.model.ConfigAgenda;
import backend.service.AgendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agenda-config")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService agendaService;

    //TELA: EDITAR AGENDA DO INSTRUTOR (Carregamento da página)

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<ConfigAgenda> obterAgenda(@PathVariable String usuarioId) {
        ConfigAgenda agenda = agendaService.buscarPorUsuario(usuarioId);
        if (agenda == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(agenda);
    }

    //TELA: EDITAR AGENDA DO INSTRUTOR (Botão "Salvar alterações")

    @PostMapping("/salvar")
    public ResponseEntity<ConfigAgenda> salvarAgenda(@RequestBody ConfigAgenda agenda) {
        return ResponseEntity.ok(agendaService.salvarOuAtualizar(agenda.getUsuarioId(), agenda));
    }


     //TELA: EXCLUIR CONFIGURAÇÃO DA AGENDA
    @DeleteMapping("/usuario/{usuarioId}")
    public ResponseEntity<Void> deletarAgenda(@PathVariable String usuarioId) {
        agendaService.deletarAgenda(usuarioId);
        return ResponseEntity.noContent().build();
    }
}