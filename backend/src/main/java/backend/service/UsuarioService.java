package backend.service;

import backend.dto.InstrutorCardDTO;
import backend.dto.RedefinirSenhaDTO;
import backend.model.*;
import backend.repository.AlunoRepository;
import backend.repository.ConfigAgendaRepository; // 🔥 Adicionado Import
import backend.repository.InstrutorRepository;
import backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepo;
    private final AlunoRepository alunoRepo;
    private final InstrutorRepository instrutorRepo;
    private final ConfigAgendaRepository configAgendaRepo;

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

    // Listar instrutores simplificados para a Home do Aluno
    public List<InstrutorCardDTO> listarInstrutoresParaHome() {
        List<Instrutor> instrutores = instrutorRepo.findAll();
        List<InstrutorCardDTO> cards = new ArrayList<>();

        for (Instrutor inst : instrutores) {
            if (inst.getUsuario() == null) continue;

            InstrutorCardDTO dto = new InstrutorCardDTO();
            dto.setInstrutorId(inst.getId());
            dto.setNome(inst.getUsuario().getNome());
            dto.setFotoPerfilUrl(inst.getBio());

            if (inst.getVeiculos() != null && !inst.getVeiculos().isEmpty()) {
                Veiculo principal = inst.getVeiculos().stream()
                        .filter(Veiculo::isPrincipal).findFirst()
                        .orElse(inst.getVeiculos().get(0));

                dto.setFotosVeiculo(principal.getFotosUrl());
                dto.setFotoPrincipalVeiculo(principal.getFotosUrl() != null && !principal.getFotosUrl().isEmpty() ? principal.getFotosUrl().get(0) : null);
                dto.setCategoriaVeiculo(principal.getCategoria());
            }

            if (inst.getLocaisAtendimento() != null && !inst.getLocaisAtendimento().isEmpty()) {
                LocalAtendimento fav = inst.getLocaisAtendimento().stream()
                        .filter(LocalAtendimento::isFavorito).findFirst()
                        .orElse(inst.getLocaisAtendimento().get(0));
                dto.setBairroCidade(fav.getBairro() + " - " + fav.getCidade());
            } else {
                dto.setBairroCidade("Endereço não informado");
            }

            configAgendaRepo.findByUsuarioId(inst.getUsuario().getId())
                    .ifPresentOrElse(
                            agenda -> dto.setValorAula(agenda.getValorAula()),
                            () -> dto.setValorAula(0.0)
                    );

            cards.add(dto);
        }
        return cards;
    }

    // alvar o endereço completo a partir das Informações Pessoais
    public Usuario atualizarDadosPessoaisComEndereco(String usuarioId, Usuario dadosAtualizados) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(dadosAtualizados.getNome());
        usuario.setEmail(dadosAtualizados.getEmail());
        usuario.setCpf(dadosAtualizados.getCpf());

        usuario.setCep(dadosAtualizados.getCep());
        usuario.setLogradouro(dadosAtualizados.getLogradouro());
        usuario.setNumero(dadosAtualizados.getNumero());
        usuario.setComplemento(dadosAtualizados.getComplemento());
        usuario.setBairro(dadosAtualizados.getBairro());
        usuario.setCidade(dadosAtualizados.getCidade());
        usuario.setEstado(dadosAtualizados.getEstado());

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