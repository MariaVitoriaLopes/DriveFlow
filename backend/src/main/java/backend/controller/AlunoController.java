package backend.controller;

import backend.model.Aluno;
import backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/alunos")
@CrossOrigin(origins = "http://localhost:4200") // Permite o Angular acessar
@RequiredArgsConstructor
public class AlunoController {

    private final UsuarioService service;

    // Endpoint para buscar aluno pelo ID do usuário logado
    @GetMapping("/{usuarioId}")
    public ResponseEntity<?> obterAluno(@PathVariable String usuarioId) {
        try {
            Aluno aluno = service.buscarAlunoPorUsuarioId(usuarioId);
            return ResponseEntity.ok(aluno);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("mensagem", e.getMessage()));
        }
    }
}