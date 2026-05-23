package backend.service;

import backend.model.*;
import backend.repository.InstrutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InstrutorConfigService {

    private final InstrutorRepository instrutorRepo;


    public Instrutor buscarPorUsuario(String usuarioId) {
        return instrutorRepo.findByUsuarioId(usuarioId)
                .orElseGet(() -> instrutorRepo.findById(usuarioId)
                        .orElseThrow(() -> new RuntimeException("Perfil de instrutor não localizado para o ID: " + usuarioId)));
    }


    // Salvar/Atualizar dados da tela Informações Gerais (Bio)
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

    // Adicionar apenas um novo endereço em branco na lista (Botão "Adicionar novo endereço")
    public Instrutor adicionarLocalEmBranco(String usuarioId) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);

        if (instrutor.getLocaisAtendimento() == null) {
            instrutor.setLocaisAtendimento(new java.util.ArrayList<>());
        }

        // Adiciona um endereço limpo com ID já gerado para o Angular renderizar o novo formulário
        instrutor.getLocaisAtendimento().add(new LocalAtendimento());
        return instrutorRepo.save(instrutor);
    }

    // Remover um endereço específico da lista pelo ID (Botão vermelho "Deletar endereço")
    public Instrutor removerLocal(String usuarioId, String localId) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);

        if (instrutor.getLocaisAtendimento() != null) {
            instrutor.getLocaisAtendimento().removeIf(local -> local.getId().equals(localId));
        }

        return instrutorRepo.save(instrutor);

    }




    ////////////////// LOGICA VEICULO//////////////
    public Instrutor atualizarTodosVeiculos(String usuarioId, List<Veiculo> novosVeiculos) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);

        // Se o usuário marcou um carro como principal, desmarca os outros
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

    // Adicionar apenas um novo veículo em branco na  (Botão "Adicionar novo veículo")
    public Instrutor adicionarVeiculoEmBranco(String usuarioId) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);

        if (instrutor.getVeiculos() == null) {
            instrutor.setVeiculos(new java.util.ArrayList<>());
        }

        instrutor.getVeiculos().add(new Veiculo()); // Insere um veículo limpo com ID pronto la da lista
        return instrutorRepo.save(instrutor);
    }

    //Remover um veículo específico da lista pelo ID (Botão "Deletar veículo")
    public Instrutor removerVeiculo(String usuarioId, String veiculoId) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);

        if (instrutor.getVeiculos() != null) {
            instrutor.getVeiculos().removeIf(v -> v.getId().equals(veiculoId));
        }

        return instrutorRepo.save(instrutor);
    }



    ///////////////////LOGICA DE DOCUMENTO////////////////////

    // 1. Salvar ou atualizar os dados e fotos da CNH
    public Instrutor atualizarCnh(String usuarioId, Documento novaCnh) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);

        // Mantém ou inicializa o status se for um envio novo
        if (instrutor.getCnh() == null || !novaCnh.getNumeroDocumento().equals(instrutor.getCnh().getNumeroDocumento())) {
            novaCnh.setStatusValidacao("PENDENTE"); // Se mudou o número, volta a ficar pendente para o Admin aprovar
        } else {
            novaCnh.setStatusValidacao(instrutor.getCnh().getStatusValidacao());
        }

        instrutor.setCnh(novaCnh);
        return instrutorRepo.save(instrutor);
    }

    // 2. Salvar ou atualizar os dados e fotos da Credencial de Instrutor
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
