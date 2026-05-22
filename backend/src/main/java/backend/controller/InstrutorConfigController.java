package backend.controller;

import backend.model.*;
import backend.service.InstrutorConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/instrutores/configuracoes")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class InstrutorConfigController {

    private final InstrutorConfigService configService;

    // Traz todas as configurações salvas para popular os formulários ao abrir a página
    @GetMapping("/{usuarioId}")
    public ResponseEntity<Instrutor> obterConfiguracoes(@PathVariable String usuarioId) {
        return ResponseEntity.ok(configService.buscarPorUsuario(usuarioId));
    }

    // Endpoint para a tela /instrutor-veiculo
    @PutMapping("/{usuarioId}/veiculo")
    public ResponseEntity<Instrutor> salvarVeiculo(@PathVariable String usuarioId, @RequestBody Veiculo veiculo) {
        return ResponseEntity.ok(configService.atualizarVeiculo(usuarioId, veiculo));
    }

    // Endpoint para a tela /instrutor-endereco
    @PutMapping("/{usuarioId}/local")
    public ResponseEntity<Instrutor> salvarLocal(@PathVariable String usuarioId, @RequestBody LocalAtendimento local) {
        return ResponseEntity.ok(configService.atualizarLocal(usuarioId, local));
    }
}