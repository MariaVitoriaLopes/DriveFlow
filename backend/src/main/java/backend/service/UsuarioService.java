package backend.service;

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
            instrutorRepo.save(instrutor);
            instrutor.setStatusValidacao("PENDENTE");
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

    public Aluno buscarAlunoPorUsuarioId(String id) {
        return alunoRepo.findByUsuarioId(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }
}