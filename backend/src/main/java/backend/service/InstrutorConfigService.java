package backend.service;

import backend.model.*;
import backend.repository.InstrutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class InstrutorConfigService {

    private final InstrutorRepository instrutorRepo;

    public Instrutor buscarPorUsuario(String usuarioId) {
        return instrutorRepo.findByUsuarioId(usuarioId)
                .orElseGet(() -> instrutorRepo.findById(usuarioId)
                        .orElseThrow(() -> new RuntimeException("Perfil de instrutor não localizado para o ID: " + usuarioId)));
    }

    public Instrutor atualizarGerais(String usuarioId, String bio) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        instrutor.setBio(bio);
        return instrutorRepo.save(instrutor);
    }

    public Instrutor atualizarFotoPerfil(String usuarioId, String fotoUrl) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        instrutor.setBio(fotoUrl);
        return instrutorRepo.save(instrutor);
    }

    //////////////////////// LÓGICA LOCAL /////////////////////////////

    public Instrutor atualizarTodosLocais(String usuarioId, List<LocalAtendimento> novosLocais) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);

        boolean temFavorito = novosLocais.stream().anyMatch(LocalAtendimento::isFavorito);
        if (temFavorito) {
            LocalAtendimento favorito = novosLocais.stream().filter(LocalAtendimento::isFavorito).findFirst().get();
            novosLocais.forEach(l -> {
                if (!l.getId().equals(favorito.getId())) l.setFavorito(false);
            });
        }

        instrutor.setLocaisAtendimento(novosLocais);
        return instrutorRepo.save(instrutor);
    }

    // 🔥 CORRIGIDO: Nome alterado para bater exatamente com o que o Controller chama!
    public Instrutor adicionarLocalEmBranco(String usuarioId) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        if (instrutor.getLocaisAtendimento() == null) {
            instrutor.setLocaisAtendimento(new ArrayList<>());
        }
        instrutor.getLocaisAtendimento().add(new LocalAtendimento());
        return instrutorRepo.save(instrutor);
    }

    public Instrutor removerLocal(String usuarioId, String localId) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        if (instrutor.getLocaisAtendimento() != null) {
            instrutor.getLocaisAtendimento().removeIf(local -> local.getId().equals(localId));
        }
        return instrutorRepo.save(instrutor);
    }

    //////////////////////// LÓGICA VEÍCULO /////////////////////////////

    public Instrutor atualizarTodosVeiculos(String usuarioId, List<Veiculo> novosVeiculos) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);

        for (Veiculo v : novosVeiculos) {
            if (v.getFotosUrl() != null && v.getFotosUrl().size() > 4) {
                throw new IllegalArgumentException("Cada veículo pode ter no máximo 4 fotos.");
            }
        }

        boolean temPrincipal = novosVeiculos.stream().anyMatch(Veiculo::isPrincipal);
        if (temPrincipal) {
            Veiculo carroPrincipal = novosVeiculos.stream().filter(Veiculo::isPrincipal).findFirst().get();
            novosVeiculos.forEach(v -> {
                if (!v.getId().equals(carroPrincipal.getId())) v.setPrincipal(false);
            });
        }

        instrutor.setVeiculos(novosVeiculos);
        return instrutorRepo.save(instrutor);
    }

    public Instrutor atualizarFotosDoVeiculo(String usuarioId, String veiculoId, List<String> fotosUrl) {
        if (fotosUrl != null && fotosUrl.size() > 4) {
            throw new IllegalArgumentException("Não é permitido adicionar mais de 4 fotos.");
        }

        Instrutor instrutor = buscarPorUsuario(usuarioId);

        if (instrutor.getVeiculos() != null) {
            for (Veiculo v : instrutor.getVeiculos()) {
                if (v.getId().equals(veiculoId)) {
                    v.setFotosUrl(fotosUrl);
                    break;
                }
            }
        }
        return instrutorRepo.save(instrutor);
    }

    public Instrutor adicionarVeiculoEmBranco(String usuarioId) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        if (instrutor.getVeiculos() == null) {
            instrutor.setVeiculos(new ArrayList<>());
        }
        instrutor.getVeiculos().add(new Veiculo());
        return instrutorRepo.save(instrutor);
    }

    public Instrutor removerVeiculo(String usuarioId, String veiculoId) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        if (instrutor.getVeiculos() != null) {
            instrutor.getVeiculos().removeIf(v -> v.getId().equals(veiculoId));
        }
        return instrutorRepo.save(instrutor);
    }

    //////////////////////// LÓGICA DOCUMENTO /////////////////////////////

    public Instrutor atualizarCnh(String usuarioId, Documento novaCnh) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        if (instrutor.getCnh() == null || !novaCnh.getNumeroDocumento().equals(instrutor.getCnh().getNumeroDocumento())) {
            novaCnh.setStatusValidacao("PENDENTE");
        } else {
            novaCnh.setStatusValidacao(instrutor.getCnh().getStatusValidacao());
        }
        instrutor.setCnh(novaCnh);
        return instrutorRepo.save(instrutor);
    }

    public Instrutor atualizarCredencial(String usuarioId, Documento novaCredencial) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        if (instrutor.getCredencialInstrutor() == null || !novaCredencial.getNumeroDocumento().equals(instrutor.getCredencialInstrutor().getNumeroDocumento())) {
            novaCredencial.setStatusValidacao("PENDENTE");
        } else {
            novaCredencial.setStatusValidacao(instrutor.getCredencialInstrutor().getStatusValidacao());
        }
        instrutor.setCredencialInstrutor(novaCredencial);
        return instrutorRepo.save(instrutor);
    }
}