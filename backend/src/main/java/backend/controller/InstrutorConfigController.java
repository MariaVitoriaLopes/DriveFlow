package backend.controller;

import backend.model.Instrutor;
import backend.model.LocalAtendimento;
import backend.model.Veiculo;
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

    // Retorna todos os dados para preencher as telas quando o instrutor entrar nelas
    @GetMapping("/{usuarioId}")
    public ResponseEntity<Instrutor> obterConfiguracoes(@PathVariable String usuarioId) {
        return ResponseEntity.ok(configService.buscarPorUsuarioId(usuarioId));
    }

    // Endpoint para salvar os dados da tela do Veículo
    @PutMapping("/{usuarioId}/veiculo")
    public ResponseEntity<Instrutor> salvarVeiculo(@PathVariable String usuarioId, @RequestBody Veiculo veiculo) {
        return ResponseEntity.ok(configService.atualizarVeiculo(usuarioId, veiculo));
    }

    // Endpoint para salvar os dados da tela de Endereço/Atendimento
    @PutMapping("/{usuarioId}/local")
    public ResponseEntity<Instrutor> salvarLocal(@PathVariable String usuarioId, @RequestBody LocalAtendimento local) {
        return ResponseEntity.ok(configService.atualizarLocal(usuarioId, local));
    }
}