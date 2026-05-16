package backend.controller;

import backend.model.Usuario;
import backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {
    @Autowired private UsuarioService service;

    @PostMapping("/cadastro")
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        return service.cadastrar(usuario);
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
}