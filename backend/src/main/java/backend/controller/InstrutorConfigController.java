package backend.controller;

import backend.model.*;
import backend.service.InstrutorConfigService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @PostMapping(
            value = "/{usuarioId}/veiculo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Instrutor> adicionarVeiculo(
            @PathVariable String usuarioId,
            @RequestPart("veiculo") String veiculoJson,
            @RequestPart(value = "fotos", required = false) List<MultipartFile> fotos
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        Veiculo veiculo = mapper.readValue(veiculoJson, Veiculo.class);

        return ResponseEntity.ok(
                configService.adicionarVeiculo(usuarioId, veiculo, fotos)
        );
    }

    @GetMapping("/{usuarioId}/veiculos")
    public ResponseEntity<List<Veiculo>> listarVeiculos(
            @PathVariable String usuarioId
    ) {
        Instrutor instrutor = configService.buscarPorUsuario(usuarioId);
        return ResponseEntity.ok(instrutor.getVeiculos());
    }

    // Endpoint para a tela /instrutor-endereco
    @PutMapping("/{usuarioId}/locais")
    public ResponseEntity<Instrutor> salvarLocais(
            @PathVariable String usuarioId,
            @RequestBody List<LocalAtendimento> locais
    ) {
        return ResponseEntity.ok(configService.salvarLocais(usuarioId, locais));
    }

    @GetMapping("/{usuarioId}/locais")
    public ResponseEntity<List<LocalAtendimento>> listarLocais(
            @PathVariable String usuarioId
    ) {
        Instrutor instrutor = configService.buscarPorUsuario(usuarioId);
        return ResponseEntity.ok(instrutor.getLocaisAtendimento());
    }

}