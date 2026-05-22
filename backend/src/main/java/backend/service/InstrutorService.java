//package backend.service;
//
//import backend.dto.InstrutorDetalhadoDTO;
//import backend.model.Aula;
//import backend.model.Documento;
//import backend.model.Instrutor;
//import backend.repository.AulaRepository;
//import backend.repository.DocumentoRepository;
//import backend.repository.InstrutorRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class InstrutorService {
//
//    private final InstrutorRepository instrutorRepo;
//    private final AulaRepository aulaRepo;
//    private final DocumentoRepository documentoRepo;
//
//    public InstrutorDetalhadoDTO detalharInstrutor(String instrutorId) {
//        Instrutor instrutor = instrutorRepo.findById(instrutorId)
//                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
//
//        List<Aula> aulas = aulaRepo.findByInstrutorId(instrutorId);
//        List<Documento> documentos = documentoRepo.findAll(); // ou filtrar por instrutor se quiser
//
//        // Calcular nota média se tiver avaliações (exemplo fictício)
//        double notaMedia = aulas.stream()
//                .mapToDouble(aula -> 0) // substitua com aula.getNota() se tiver no seu model
//                .average().orElse(0);
//
//        InstrutorDetalhadoDTO dto = new InstrutorDetalhadoDTO();
//        dto.setId(instrutor.getId());
//        dto.setUsuario(instrutor.getUsuario());
//        dto.setLocalAtendimento(instrutor.getLocalAtendimento());
//        dto.setVeiculo(instrutor.getVeiculo());
//        dto.setBio(instrutor.getBio());
//        dto.setReceberNotificacoes(instrutor.isReceberNotificacoes());
//        dto.setAulas(aulas);
//        dto.setDocumentos(documentos);
//        dto.setNotaMedia(notaMedia);
//
//        return dto;
//    }
//}