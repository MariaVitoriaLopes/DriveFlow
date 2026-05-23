package backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import backend.model.*;
import backend.repository.InstrutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InstrutorConfigService {

    private final InstrutorRepository instrutorRepo;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public Instrutor buscarPorUsuario(String usuarioId) {
        return instrutorRepo.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Perfil de instrutor não localizado."));
    }

    public Instrutor adicionarVeiculo(
            String usuarioId,
            Veiculo veiculo,
            List<MultipartFile> fotos
    ) throws Exception {

        Instrutor instrutor = buscarPorUsuario(usuarioId);

        List<String> urlsFotos = new ArrayList<>();

        if (fotos != null && !fotos.isEmpty()) {

            Path pastaUploads = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(pastaUploads);

            for (MultipartFile foto : fotos) {

                if (foto.isEmpty()) {
                    continue;
                }

                String nomeOriginal = foto.getOriginalFilename();
                String extensao = "";

                if (nomeOriginal != null && nomeOriginal.contains(".")) {
                    extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
                }

                String nomeArquivo = UUID.randomUUID().toString() + extensao;

                Path caminho = pastaUploads.resolve(nomeArquivo);

                Files.write(caminho, foto.getBytes());

                urlsFotos.add("http://localhost:8081/uploads/" + nomeArquivo);
            }
        }

        veiculo.setFotoUrls(urlsFotos);

        if (!urlsFotos.isEmpty()) {
            veiculo.setFotoUrl(urlsFotos.get(0));
        }

        if (instrutor.getVeiculos() == null) {
            instrutor.setVeiculos(new ArrayList<>());
        }

        instrutor.getVeiculos().add(veiculo);

        return instrutorRepo.save(instrutor);
    }

    public Instrutor salvarLocais(
            String usuarioId,
            List<LocalAtendimento> locais
    ) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);

        boolean jaTemFavorito = false;

        for (LocalAtendimento local : locais) {
            if (Boolean.TRUE.equals(local.getFavorito())) {
                if (!jaTemFavorito) {
                    jaTemFavorito = true;
                } else {
                    local.setFavorito(false);
                }
            }
        }

        instrutor.setLocaisAtendimento(locais);

        return instrutorRepo.save(instrutor);
    }

    public Instrutor atualizarGerais(String usuarioId, String bio) {
        Instrutor instrutor = buscarPorUsuario(usuarioId);
        instrutor.setBio(bio);
        return instrutorRepo.save(instrutor);
    }
}