package backend.service;

import backend.model.Aluno;
import backend.model.Instrutor;
import backend.model.Usuario;
import backend.repository.AlunoRepository;
import backend.repository.InstrutorRepository;
import backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private AlunoRepository alunoRepo;

    @Autowired
    private InstrutorRepository instrutorRepo;

    public Usuario cadastrar(Usuario usuario) {

        Usuario usuarioSalvo = usuarioRepo.save(usuario);


        if ("ALUNO".equalsIgnoreCase(usuarioSalvo.getPerfil())) {
            Aluno aluno = new Aluno();
            aluno.setUsuario(usuarioSalvo);
            alunoRepo.save(aluno);
        } else if ("INSTRUTOR".equalsIgnoreCase(usuarioSalvo.getPerfil())) {
            Instrutor instrutor = new Instrutor();
            instrutor.setUsuario(usuarioSalvo);
            instrutorRepo.save(instrutor);
        }

        return usuarioSalvo;
    }

    public Usuario login(String email, String senha) {
        return usuarioRepo.findByEmail(email)
                .filter(user -> user.getSenha().equals(senha))
                .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos"));
    }
}