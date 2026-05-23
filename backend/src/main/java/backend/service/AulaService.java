package backend.service;

import backend.model.Aula;
import backend.repository.AulaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AulaService {

    private final AulaRepository aulaRepo;

    // Retorna a lista de alunos do dia selecionado
    public List<Aula> buscarAgendaDoDia(String instrutorId, LocalDate data) {
        return aulaRepo.findByInstrutorIdAndData(instrutorId, data);
    }

    // Cria um agendamento novo
    public Aula agendarAula(Aula novaAula) {
        novaAula.setStatus("AGENDADA");
        return aulaRepo.save(novaAula);
    }

    // Cancela a aula (Botão "Cancelar aula" do card da Ana)
    public Aula cancelarAula(String aulaId) {
        Aula aula = aulaRepo.findById(aulaId)
                .orElseThrow(() -> new RuntimeException("Aula não encontrada"));
        aula.setStatus("CANCELADA");
        return aulaRepo.save(aula);
    }
}