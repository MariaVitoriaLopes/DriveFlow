package backend.controller;

import backend.dto.RedefinirSenhaDTO;
import backend.model.Usuario;
import backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService service; // 🔥 O nome da variável aqui é "service"

    @PostMapping("/cadastro")
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        System.out.println("Recebendo requisição de cadastro para o perfil: " + usuario.getPerfil());
        Usuario usuarioSalvo = service.cadastrar(usuario);
        return ResponseEntity.ok(usuarioSalvo);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        try {
            Usuario usuarioLogado = service.login(credenciais.get("email"), credenciais.get("senha"));
            return ResponseEntity.ok(usuarioLogado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("mensagem", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PutMapping("/{id}/dados-pessoais")
    public ResponseEntity<Usuario> atualizarDados(@PathVariable String id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(service.atualizarDadosPessoais(id, usuario));
    }

    // Alterar a Senha
    @PutMapping("/{id}/redefinir-senha")
    public ResponseEntity<String> alterarSenha(@PathVariable String id, @RequestBody RedefinirSenhaDTO dto) {
        service.redefinirSenha(id, dto);
        return ResponseEntity.ok("Senha alterada com sucesso!");
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConta(@PathVariable String id) {

        service.deletarConta(id);
        return ResponseEntity.noContent().build();
    }
}