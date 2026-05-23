package backend.controller;

import backend.model.*;
import backend.service.InstrutorConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instrutores/configuracoes")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class InstrutorConfigController {

    private final InstrutorConfigService configService;

    // Traz todas as configurações atuais do Instrutor de uma vez para carregar a página
    @GetMapping("/{usuarioId}")
    public ResponseEntity<Instrutor> obterConfiguracoes(@PathVariable String usuarioId) {
        return ResponseEntity.ok(configService.buscarPorUsuario(usuarioId));
    }

    @PutMapping("/{usuarioId}/bio")
    public ResponseEntity<Instrutor> salvarBio(@PathVariable String usuarioId, @RequestBody String bio) {
        return ResponseEntity.ok(configService.atualizarGerais(usuarioId, bio));
    }

    // Endpoint para os botões "Enviar foto" e "Remover foto"
    @PutMapping("/{usuarioId}/foto")
    public ResponseEntity<Instrutor> salvarFoto(@PathVariable String usuarioId, @RequestBody String fotoUrl) {
        return ResponseEntity.ok(configService.atualizarFotoPerfil(usuarioId, fotoUrl));
    }

    ////////////////////////LOCAL/////////////////////////////
    @PutMapping("/{usuarioId}/locais")
    public ResponseEntity<Instrutor> salvarTodosLocais(@PathVariable String usuarioId, @RequestBody List<LocalAtendimento> locais) {
        return ResponseEntity.ok(configService.atualizarTodosLocais(usuarioId, locais));
    }

    // Rota para o botão "Adicionar novo endereço" -> Cria um nó vazio e retorna para o front
    @PostMapping("/{usuarioId}/locais/novo")
    public ResponseEntity<Instrutor> criarNovoCardEmBranco(@PathVariable String usuarioId) {
        return ResponseEntity.ok(configService.addLocalEmBranco(usuarioId));
    }

    // Rota para o botão vermelho "Deletar endereço" -> Remove direto passando o ID do endereço na URL
    @DeleteMapping("/{usuarioId}/locais/{localId}")
    public ResponseEntity<Instrutor> deletarCardEndereco(@PathVariable String usuarioId, @PathVariable String localId) {
        return ResponseEntity.ok(configService.removerLocal(usuarioId, localId));
    }


    //////////////////VEICULO//////////////

    //////////////////////// VEICULO /////////////////////////////

    // Rota dedicada para atualizar apenas as fotos de um veículo específico
    @PutMapping("/{usuarioId}/veiculos/{veiculoId}/fotos")
    public ResponseEntity<Instrutor> atualizarFotosVeiculo(
            @PathVariable String usuarioId,
            @PathVariable String veiculoId,
            @RequestBody List<String> fotosUrl) {
        return ResponseEntity.ok(configService.atualizarFotosDoVeiculo(usuarioId, veiculoId, fotosUrl));
    } // <-- Chave de fechamento do método tratada corretamente!

    // Rota para atualizar todos os dados do veículo
    @PutMapping("/{usuarioId}/veiculos")
    public ResponseEntity<Instrutor> salvarTodosVeiculos(
            @PathVariable String usuarioId,
            @RequestBody List<Veiculo> veiculos) {
        return ResponseEntity.ok(configService.atualizarTodosVeiculos(usuarioId, veiculos));
    }

    // Rota para o botão "Adicionar novo veículo"
    @PostMapping("/{usuarioId}/veiculos/novo")
    public ResponseEntity<Instrutor> criarNovoVeiculoEmBranco(@PathVariable String usuarioId) {
        return ResponseEntity.ok(configService.adicionarVeiculoEmBranco(usuarioId));
    }

    // Rota para o botão vermelho "Deletar veículo"
    @DeleteMapping("/{usuarioId}/veiculos/{veiculoId}")
    public ResponseEntity<Instrutor> deletarCardVeiculo(
            @PathVariable String usuarioId,
            @PathVariable String veiculoId) {
        return ResponseEntity.ok(configService.removerVeiculo(usuarioId, veiculoId));
    }



///////////////////// DOCUMENTO////////////
    // Endpoint para salvar a CNH do instrutor
    @PutMapping("/{usuarioId}/documentos/cnh")
    public ResponseEntity<Instrutor> salvarCnh(@PathVariable String usuarioId, @RequestBody Documento cnh) {
        return ResponseEntity.ok(configService.atualizarCnh(usuarioId, cnh));
    }

    // Endpoint para salvar a Credencial do instrutor
    @PutMapping("/{usuarioId}/documentos/credencial")
    public ResponseEntity<Instrutor> salvarCredencial(@PathVariable String usuarioId, @RequestBody Documento credencial) {
        return ResponseEntity.ok(configService.atualizarCredencial(usuarioId, credencial));
    }
}