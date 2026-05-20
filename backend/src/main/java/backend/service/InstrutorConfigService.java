package backend.service;

import backend.model.Instrutor;
import backend.model.LocalAtendimento;
import backend.model.Veiculo;
import backend.repository.InstrutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InstrutorConfigService {

    private final InstrutorRepository instrutorRepo;

    // Busca as configurações atuais do instrutor pelo ID do Usuário logado
    public Instrutor buscarPorUsuarioId(String usuarioId) {
        return instrutorRepo.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
    }

    //  Atualiza a tela de Veículo
    public Instrutor atualizarVeiculo(String usuarioId, Veiculo novoVeiculo) {
        Instrutor instrutor = buscarPorUsuarioId(usuarioId);
        instrutor.setVeiculo(novoVeiculo);
        return instrutorRepo.save(instrutor);
    }

    // Atualiza a tela de Local de Atendimento / Endereço
    public Instrutor atualizarLocal(String usuarioId, LocalAtendimento novoLocal) {
        Instrutor instrutor = buscarPorUsuarioId(usuarioId);
        instrutor.setLocalAtendimento(novoLocal);
        return instrutorRepo.save(instrutor);
    }


}