package backend.service;

import backend.model.ConfigAgenda;
import backend.model.DispoSemanal;
import backend.repository.ConfigAgendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AgendaService {

    private final ConfigAgendaRepository agendaRepo;

    public ConfigAgenda buscarPorUsuario(String usuarioId) {
        return agendaRepo.findByUsuarioId(usuarioId).orElse(null);
    }

    public ConfigAgenda salvarOuAtualizar(String usuarioId, ConfigAgenda novaAgenda) {
        if (novaAgenda.getValorAula() < 1) {
            throw new IllegalArgumentException("O valor da aula deve ser no mínimo R$ 1,00.");
        }

        if (novaAgenda.getDisponibilidades() != null) {
            for (DispoSemanal d : novaAgenda.getDisponibilidades()) {
                if (!d.isBloqueado()) {
                    LocalTime inicio = LocalTime.parse(d.getHoraInicio());
                    LocalTime fim = LocalTime.parse(d.getHoraFim());

                    if (inicio.isBefore(LocalTime.of(6, 0))) {
                        throw new IllegalArgumentException("O expediente não pode iniciar antes das 06:00.");
                    }
                    if (inicio.isAfter(LocalTime.of(22, 0))) {
                        throw new IllegalArgumentException("O último horário de início permitido é 22:00.");
                    }
                    if (fim.isAfter(LocalTime.of(23, 0))) {
                        throw new IllegalArgumentException("O horário final de atendimento não pode passar das 23:00.");
                    }
                    if (inicio.isAfter(fim) || inicio.equals(fim)) {
                        throw new IllegalArgumentException("O horário de início deve ser menor que o horário de término.");
                    }
                }
            }
        }

        Optional<ConfigAgenda> agendaExistente = agendaRepo.findByUsuarioId(usuarioId);
        if (agendaExistente.isPresent()) {
            ConfigAgenda atual = agendaExistente.get();
            atual.setDuracaoAula(novaAgenda.getDuracaoAula());
            atual.setValorAula(novaAgenda.getValorAula());
            atual.setIntervaloAula(novaAgenda.getIntervaloAula());
            atual.setToleranciaEspera(novaAgenda.getToleranciaEspera());
            atual.setDisponibilidades(novaAgenda.getDisponibilidades());
            return agendaRepo.save(atual);
        }

        novaAgenda.setUsuarioId(usuarioId);
        return agendaRepo.save(novaAgenda);
    }

    public void deletarAgenda(String usuarioId) {
        ConfigAgenda agenda = agendaRepo.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Agenda não localizada para exclusão."));
        agendaRepo.delete(agenda);
    }
}