package backend.service;

import backend.model.Instrutor;
import backend.repository.InstrutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InstrutorService {

    private final InstrutorRepository instrutorRepo;

    // Lista todos os instrutores
    public List<Instrutor> listarTodos() {
        return instrutorRepo.findAll();
    }

    // Pega um instrutor específico pelo ID
    public Instrutor buscarPorId(String id) {
        return instrutorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
    }
}