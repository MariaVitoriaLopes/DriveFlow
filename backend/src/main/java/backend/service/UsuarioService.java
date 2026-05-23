package backend.service;

import backend.dto.RedefinirSenhaDTO; // Lembre-se de criar este DTO na pasta dto
import backend.model.Aluno;
import backend.model.Instrutor;
import backend.model.Usuario;
import backend.repository.AlunoRepository;
import backend.repository.InstrutorRepository;
import backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepo;
    private final AlunoRepository alunoRepo;
    private final InstrutorRepository instrutorRepo;


    public Usuario cadastrar(Usuario usuario) {
        if (usuarioRepo.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("Este e-mail já está cadastrado!");
        }

        Usuario usuarioSalvo = usuarioRepo.save(usuario);

        if ("ALUNO".equalsIgnoreCase(usuarioSalvo.getPerfil())) {
            Aluno aluno = new Aluno();
            aluno.setUsuario(usuarioSalvo);
            alunoRepo.save(aluno);
        } else if ("INSTRUTOR".equalsIgnoreCase(usuarioSalvo.getPerfil())) {
            Instrutor instrutor = new Instrutor();
            instrutor.setUsuario(usuarioSalvo);

            instrutor.setStatusValidacao("PENDENTE");

            instrutorRepo.save(instrutor);
        }

        return usuarioSalvo;
    }


    public Usuario login(String email, String senha) {
        return usuarioRepo.findByEmail(email)
                .filter(user -> user.getSenha().equals(senha))
                .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos"));
    }

    public List<Usuario> listarTodos() {
        return usuarioRepo.findAll();
    }


    public Usuario atualizarDadosPessoais(String usuarioId, Usuario dadosAtualizados) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o ID: " + usuarioId));

        usuario.setNome(dadosAtualizados.getNome());
        usuario.setEmail(dadosAtualizados.getEmail());
        usuario.setCpf(dadosAtualizados.getCpf());
        return usuarioRepo.save(usuario);
    }


    public void redefinirSenha(String usuarioId, RedefinirSenhaDTO dto) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));


        if (!usuario.getSenha().equals(dto.getSenhaAntiga())) {
            throw new RuntimeException("A senha antiga informada está incorreta.");
        }

        usuario.setSenha(dto.getSenhaNova());
        usuarioRepo.save(usuario);
    }


    public void deletarConta(String usuarioId) {
        if (!usuarioRepo.existsById(usuarioId)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        usuarioRepo.deleteById(usuarioId);
    }
}