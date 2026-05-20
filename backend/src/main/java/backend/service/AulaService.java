package backend.service;

import backend.model.Aula;
import backend.repository.AulaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AulaService {

    @Autowired
    private AulaRepository aulaRepository;

    public Aula agendarAula(Aula aula) {
        aula.setStatus("AGENDADA");
        return aulaRepository.save(aula);
    }

    public List<Aula> listarPorInstrutor(String instrutorId) {
        return aulaRepository.findByInstrutorId(instrutorId);
    }

    public List<Aula> listarPorAluno(String alunoId) {
        return aulaRepository.findByAlunoId(alunoId);
    }
}