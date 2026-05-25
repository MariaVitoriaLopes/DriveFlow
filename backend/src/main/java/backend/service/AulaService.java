package backend.service;

import backend.dto.DisponibilidadeDiaResponseDTO;
import backend.dto.HorarioSlotDTO;
import backend.model.*;
import backend.repository.AulaRepository;
import backend.repository.ConfigAgendaRepository;
import backend.repository.InstrutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AulaService {

    private final AulaRepository aulaRepo;
    private final ConfigAgendaRepository agendaRepo;
    private final InstrutorRepository instrutorRepo;

    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    public List<Aula> buscarAgendaDoDia(String instrutorId, LocalDate data) {
        return aulaRepo.findByInstrutorIdAndData(instrutorId, data);
    }

    public Aula cancelarAula(String aulaId) {
        Aula aula = aulaRepo.findById(aulaId)
                .orElseThrow(() -> new RuntimeException("Aula não encontrada"));
        aula.setStatus("CANCELADA");
        return aulaRepo.save(aula);
    }

    // 🔥 Calcula os blocos de horários disponíveis para exibição no Front-end do Aluno
    public DisponibilidadeDiaResponseDTO consultarHorariosDisponiveis(String instrutorId, LocalDate data) {
        DisponibilidadeDiaResponseDTO response = new DisponibilidadeDiaResponseDTO();
        response.setData(data);
        response.setHorarios(new ArrayList<>());

        ConfigAgenda agenda = agendaRepo.findByUsuarioId(instrutorId)
                .orElseThrow(() -> new RuntimeException("Configuração de agenda não encontrada para este instrutor."));

        response.setDuracaoAula(agenda.getDuracaoAula());
        response.setIntervaloAula(agenda.getIntervaloAula());
        response.setToleranciaAtraso(agenda.getToleranciaEspera());

        String diaSemanaDesejado = data.getDayOfWeek().name();
        String diaTraduzido = traduzirDiaSemana(diaSemanaDesejado);

        DispoSemanal dispoDia = agenda.getDisponibilidades().stream()
                .filter(d -> d.getDiaSemana().equalsIgnoreCase(diaTraduzido))
                .findFirst()
                .orElse(null);

        if (dispoDia == null || dispoDia.isBloqueado()) {
            return response;
        }

        List<Aula> aulasAgendadas = aulaRepo.findByInstrutorIdAndDataAndStatus(instrutorId, data, "AGENDADA");

        LocalTime horaAtual = LocalTime.parse(dispoDia.getHoraInicio());
        LocalTime limiteFim = LocalTime.parse(dispoDia.getHoraFim());
        int passoTotal = agenda.getDuracaoAula() + agenda.getIntervaloAula();

        while (horaAtual.plusMinutes(agenda.getDuracaoAula()).isBefore(limiteFim) || horaAtual.plusMinutes(agenda.getDuracaoAula()).equals(limiteFim)) {

            LocalTime fimUma = horaAtual.plusMinutes(agenda.getDuracaoAula());
            LocalTime fimDuas = horaAtual.plusMinutes((agenda.getDuracaoAula() * 2) + agenda.getIntervaloAula());

            boolean podeUma = !verificarColisao(horaAtual, fimUma, aulasAgendadas);
            boolean podeDuas = (fimDuas.isBefore(limiteFim) || fimDuas.equals(limiteFim))
                    && !verificarColisao(horaAtual, fimDuas, aulasAgendadas);

            response.getHorarios().add(new HorarioSlotDTO(
                    horaAtual.format(timeFormatter),
                    fimUma.format(timeFormatter),
                    fimDuas.format(timeFormatter),
                    podeUma,
                    podeDuas
            ));

            horaAtual = horaAtual.plusMinutes(passoTotal);
        }

        return response;
    }

    // 🔥 Efetua o agendamento validando automaticamente colidência de horários e inserindo preços e carros
    public Aula agendarAula(Aula novaAula) {
        ConfigAgenda agenda = agendaRepo.findByUsuarioId(novaAula.getInstrutorId())
                .orElseThrow(() -> new RuntimeException("Configuração de agenda do instrutor não encontrada."));

        Instrutor instrutor = instrutorRepo.findByUsuarioId(novaAula.getInstrutorId())
                .orElseThrow(() -> new RuntimeException("Perfil do instrutor não encontrado."));

        LocalTime inicio = LocalTime.parse(novaAula.getHorarioInicio());
        int totalMinutos = (agenda.getDuracaoAula() * novaAula.getQuantidadeAulas());
        if (novaAula.getQuantidadeAulas() == 2) {
            totalMinutos += agenda.getIntervaloAula();
        }
        LocalTime fim = inicio.plusMinutes(totalMinutos);

        List<Aula> conflitos = aulaRepo.findByInstrutorIdAndDataAndStatus(novaAula.getInstrutorId(), novaAula.getData(), "AGENDADA");
        if (verificarColisao(inicio, fim, conflitos)) {
            throw new IllegalArgumentException("Conflito detectado: O horário selecionado já está preenchido por outro aluno.");
        }

        novaAula.setHorarioFim(fim.format(timeFormatter));
        novaAula.setDuracaoAula(agenda.getDuracaoAula());
        novaAula.setIntervaloAula(agenda.getIntervaloAula());
        novaAula.setToleranciaAtraso(agenda.getToleranciaEspera());
        novaAula.setValorAula(agenda.getValorAula());
        novaAula.setTaxa(0.0);
        novaAula.setTotal(agenda.getValorAula() * novaAula.getQuantidadeAulas());
        novaAula.setStatus("AGENDADA");

        if (instrutor.getVeiculos() != null && !instrutor.getVeiculos().isEmpty()) {
            Veiculo principal = instrutor.getVeiculos().stream()
                    .filter(Veiculo::isPrincipal).findFirst().orElse(instrutor.getVeiculos().get(0));
            novaAula.setVeiculoId(principal.getId());
        }

        return aulaRepo.save(novaAula);
    }

    private boolean verificarColisao(LocalTime inicio, LocalTime fim, List<Aula> aulas) {
        for (Aula aula : aulas) {
            LocalTime aInicio = LocalTime.parse(aula.getHorarioInicio());
            LocalTime aFim = LocalTime.parse(aula.getHorarioFim());
            if (inicio.isBefore(aFim) && fim.isAfter(aInicio)) {
                return true;
            }
        }
        return false;
    }

    private String traduzirDiaSemana(String englishDay) {
        switch (englishDay) {
            case "MONDAY": return "SEGUNDA";
            case "TUESDAY": return "TERCA";
            case "WEDNESDAY": return "QUARTA";
            case "THURSDAY": return "QUINTA";
            case "FRIDAY": return "SEXTA";
            case "SATURDAY": return "SABADO";
            default: return "DOMINGO";
        }
    }
}