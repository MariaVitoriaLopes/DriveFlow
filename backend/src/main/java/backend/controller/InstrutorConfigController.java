package backend.controller;

import backend.model.Instrutor;
import backend.model.LocalAtendimento;
import backend.model.Veiculo;
import backend.model.Documento;
import backend.service.InstrutorConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/instrutores/configuracoes")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class InstrutorConfigController {

    private final InstrutorConfigService configService;

    @Value("${uploads.fotos.path:uploads/fotos}")
    private String caminhoUploads; // pega do application.properties ou usa padrão

    // Buscar perfil completo do instrutor
    @GetMapping("/{usuarioId}")
    public ResponseEntity<Instrutor> obterConfiguracoes(@PathVariable String usuarioId) {
        return ResponseEntity.ok(configService.buscarPorUsuario(usuarioId));
    }

    @PutMapping("/{usuarioId}/bio")
    public ResponseEntity<Instrutor> salvarBio(@PathVariable String usuarioId, @RequestBody String bio) {
        return ResponseEntity.ok(configService.atualizarGerais(usuarioId, bio));
    }

    @PutMapping("/{usuarioId}/foto")
    public ResponseEntity<Instrutor> salvarFoto(
            @PathVariable String usuarioId,
            @RequestParam("foto") MultipartFile foto) {

        try {
            // Cria a pasta automaticamente caso não exista
            Path pastaFotos = Paths.get(caminhoUploads);
            if (!Files.exists(pastaFotos)) {
                Files.createDirectories(pastaFotos);
            }

            // Nome único do arquivo
            String nomeArquivo = usuarioId + "_" + System.currentTimeMillis() + "_" + foto.getOriginalFilename();
            Path caminhoArquivo = pastaFotos.resolve(nomeArquivo);

            // Salva o arquivo fisicamente
            Files.write(caminhoArquivo, foto.getBytes());

            // Cria URL pública da foto
            String fotoUrl = "http://localhost:8081/" + caminhoUploads + "/" + nomeArquivo;

            // Atualiza a foto no banco
            Instrutor instrutor = configService.atualizarFotoPerfil(usuarioId, fotoUrl);

            return ResponseEntity.ok(instrutor);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Endpoint para detalhes do instrutor para o aluno
    @GetMapping("/detalhes-aluno/{instrutorId}")
    public ResponseEntity<backend.dto.InstrutorPerfilCompletoDTO> obterDetalhesParaAgendamento(@PathVariable String instrutorId) {
        return ResponseEntity.ok(configService.obterPerfilCompletoParaAluno(instrutorId));
    }

    //////////////////////// LOCAL /////////////////////////////
    @PutMapping("/{usuarioId}/locais")
    public ResponseEntity<Instrutor> salvarTodosLocais(@PathVariable String usuarioId, @RequestBody List<LocalAtendimento> locais) {
        return ResponseEntity.ok(configService.atualizarTodosLocais(usuarioId, locais));
    }

    @PostMapping("/{usuarioId}/locais/novo")
    public ResponseEntity<Instrutor> criarNovoCardEmBranco(@PathVariable String usuarioId) {
        return ResponseEntity.ok(configService.adicionarLocalEmBranco(usuarioId));
    }

    @DeleteMapping("/{usuarioId}/locais/{localId}")
    public ResponseEntity<Instrutor> deletarCardEndereco(@PathVariable String usuarioId, @PathVariable String localId) {
        return ResponseEntity.ok(configService.removerLocal(usuarioId, localId));
    }

    ////////////////////// VEÍCULO /////////////////////////////
    @PutMapping("/{usuarioId}/veiculos/{veiculoId}/fotos")
    public ResponseEntity<Instrutor> atualizarFotosVeiculo(
            @PathVariable String usuarioId,
            @PathVariable String veiculoId,
            @RequestBody List<String> fotosUrl) {
        return ResponseEntity.ok(configService.atualizarFotosDoVeiculo(usuarioId, veiculoId, fotosUrl));
    }

    @PutMapping("/{usuarioId}/veiculos")
    public ResponseEntity<Instrutor> salvarTodosVeiculos(@PathVariable String usuarioId, @RequestBody List<Veiculo> veiculos) {
        return ResponseEntity.ok(configService.atualizarTodosVeiculos(usuarioId, veiculos));
    }

    @PostMapping("/{usuarioId}/veiculos/novo")
    public ResponseEntity<Instrutor> criarNovoVeiculoEmBranco(@PathVariable String usuarioId) {
        return ResponseEntity.ok(configService.adicionarVeiculoEmBranco(usuarioId));
    }

    @DeleteMapping("/{usuarioId}/veiculos/{veiculoId}")
    public ResponseEntity<Instrutor> deletarCardVeiculo(@PathVariable String usuarioId, @PathVariable String veiculoId) {
        return ResponseEntity.ok(configService.removerVeiculo(usuarioId, veiculoId));
    }

    ///////////////////// DOCUMENTO ////////////////////////////
    @PutMapping("/{usuarioId}/documentos/cnh")
    public ResponseEntity<Instrutor> salvarCnh(@PathVariable String usuarioId, @RequestBody Documento cnh) {
        return ResponseEntity.ok(configService.atualizarCnh(usuarioId, cnh));
    }

    @PutMapping("/{usuarioId}/documentos/credencial")
    public ResponseEntity<Instrutor> salvarCredencial(@PathVariable String usuarioId, @RequestBody Documento credencial) {
        return ResponseEntity.ok(configService.atualizarCredencial(usuarioId, credencial));
    }
}