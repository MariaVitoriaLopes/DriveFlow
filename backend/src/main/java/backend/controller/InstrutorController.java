package backend.controller;

import backend.model.Instrutor;
import backend.service.InstrutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instrutores")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class InstrutorController {

    private final InstrutorService instrutorService;

    @GetMapping
    public List<Instrutor> getInstrutores() {
        return instrutorService.listarTodos();
    }

    @GetMapping("/{id}")
    public Instrutor getInstrutor(@PathVariable String id) {
        return instrutorService.buscarPorId(id);
    }
}