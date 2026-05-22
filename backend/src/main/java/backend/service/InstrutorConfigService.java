package backend.service;

import backend.model.*;
import backend.repository.InstrutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InstrutorConfigService {

    private final InstrutorRepository instrutorRepo;

    public Instrutor buscarPorUsuario(String usuarioId) {
        return instrutorRepo.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Perfil de instrutor não localizado."));
    }

    // Salvar/Atualizar dados da tela Veículo
    public Instrutor atualizarVeiculo(String usuarioId, Veiculo veiculo) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        instrutor.setVeiculo(veiculo);
        return instrutorRepo.save(instrutor);
    }

    // Salvar/Atualizar dados da tela Endereço
    public Instrutor atualizarLocal(String usuarioId, LocalAtendimento local) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        instrutor.setLocalAtendimento(local);
        return instrutorRepo.save(instrutor);
    }

    // Salvar/Atualizar dados da tela Informações Gerais (Bio)
    public Instrutor atualizarGerais(String usuarioId, String bio) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        instrutor.setBio(bio);
        return instrutorRepo.save(instrutor);
    }
}