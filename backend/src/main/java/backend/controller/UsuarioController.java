package backend.controller;

import backend.model.Usuario;
import backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200") // Permite a comunicação direta com o seu Angular
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService service;

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
            // Retorna o status 401 (Não autorizado) com a mensagem de erro para o Angular capturar
            return ResponseEntity.status(401).body(Map.of("mensagem", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }
}