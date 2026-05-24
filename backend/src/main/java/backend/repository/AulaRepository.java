package backend.repository;

import backend.model.Aula;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface AulaRepository extends MongoRepository<Aula, String> {

    // Busca as aulas de um instrutor em um dia específico (Para a lista "Agenda de hoje")
    List<Aula> findByInstrutorIdAndData(String instrutorId, LocalDate data);

    // Busca as aulas do mês para desenhar as bolinhas do calendário
    List<Aula> findByInstrutorIdAndDataBetween(String instrutorId, LocalDate inicio, LocalDate fim);
}