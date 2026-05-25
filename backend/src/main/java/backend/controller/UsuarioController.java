package backend.controller;

import backend.dto.InstrutorCardDTO;
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

    @PostMapping("/cadastro")
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        System.out.println("Recebendo requisição de cadastro para o perfil: " + usuario.getPerfil());
        Usuario usuarioSalvo = usuarioService.cadastrar(usuario);
        return ResponseEntity.ok(usuarioSalvo);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        try {
            Usuario usuarioLogado = usuarioService.login(credenciais.get("email"), credenciais.get("senha"));
            return ResponseEntity.ok(usuarioLogado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("mensagem", e.getMessage()));
        }
    }


    private final UsuarioService usuarioService;

    // Rota padrão para listar todos os usuários (caso use na listagem geral)
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    // Rota para alterar/redefinir senha
    @PutMapping("/{id}/redefinir-senha")
    public ResponseEntity<String> alterarSenha(@PathVariable String id, @RequestBody RedefinirSenhaDTO dto) {
        usuarioService.redefinirSenha(id, dto);
        return ResponseEntity.ok("Senha alterada com sucesso!");
    }

    // Endpoint para a home do Aluno (Listar cards dos instrutores)
    @GetMapping("/instrutores")
    public ResponseEntity<List<InstrutorCardDTO>> obterInstrutoresHome() {
        return ResponseEntity.ok(usuarioService.listarInstrutoresParaHome());
    }

    // Atualização dos dados pessoais que agora salva o endereço completo
    @PutMapping("/{id}/dados-pessoais")
    public ResponseEntity<Usuario> atualizarDados(@PathVariable String id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.atualizarDadosPessoaisComEndereco(id, usuario));
    }

    // Rota para deletar conta do usuário
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConta(@PathVariable String id) {
        usuarioService.deletarConta(id);
        return ResponseEntity.noContent().build();
    }
}