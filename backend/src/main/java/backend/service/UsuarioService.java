package backend.service;

import backend.model.Aluno;
import backend.model.Instrutor;
import backend.model.Usuario;
import backend.repository.AlunoRepository;
import backend.repository.InstrutorRepository;
import backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor; // 🔥 Adicionado para limpar os @Autowired
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor // 🔥 O Lombok cria o construtor para injetar todos os repositórios 'final' automaticamente
public class UsuarioService {

    private final UsuarioRepository usuarioRepo;
    private final AlunoRepository alunoRepo;
    private final InstrutorRepository instrutorRepo;

    public Usuario cadastrar(Usuario usuario) {
        // Validação preventiva: não deixa cadastrar e-mails duplicados
        if (usuarioRepo.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("Este e-mail já está cadastrado!");
        }

        // Salva o usuário base
        Usuario usuarioSalvo = usuarioRepo.save(usuario);

        // Executa a sua lógica original de ramificação por perfil usando as facilidades do Lombok
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

    // 🔴 ADICIONE ESTE MÉTODO: Ele é a peça que faltava para a tela de Aulas do Angular funcionar!
    public List<Usuario> listarTodos() {
        return usuarioRepo.findAll();
    }

    public Aluno buscarAlunoPorUsuarioId(String id) {
        return alunoRepo.findByUsuarioId(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }
}