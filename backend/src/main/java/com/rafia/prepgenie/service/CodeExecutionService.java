package com.rafia.prepgenie.service;

import com.rafia.prepgenie.dto.CodeExecutionRequest;
import com.rafia.prepgenie.dto.CodeExecutionResponse;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class CodeExecutionService {

    public CodeExecutionResponse executeCode(CodeExecutionRequest request) {
        String lang = request.getLanguage().toLowerCase();
        String code = request.getCode();
        
        String tempDirName = System.getProperty("java.io.tmpdir") + File.separator + "prepgenie_" + UUID.randomUUID().toString();
        File tempDir = new File(tempDirName);
        tempDir.mkdirs();

        try {
            switch (lang) {
                case "java":
                    return runJava(code, tempDir);
                case "python":
                    return runPython(code, tempDir);
                case "cpp":
                case "c++":
                    return runCpp(code, tempDir);
                case "c":
                    return runC(code, tempDir);
                default:
                    return new CodeExecutionResponse("", "Language not supported: " + lang, false);
            }
        } catch (Exception e) {
            return new CodeExecutionResponse("", "Server Error: " + e.getMessage(), false);
        } finally {
            deleteDirectory(tempDir);
        }
    }

    private CodeExecutionResponse runJava(String code, File tempDir) throws IOException, InterruptedException {
        File sourceFile = new File(tempDir, "Main.java");
        Files.write(sourceFile.toPath(), code.getBytes());

        // Compile
        Process compileProcess = new ProcessBuilder("javac", "Main.java")
                .directory(tempDir)
                .start();
        
        String compileError = readStream(compileProcess.getErrorStream());
        if (!compileProcess.waitFor(10, TimeUnit.SECONDS) || compileProcess.exitValue() != 0) {
            return new CodeExecutionResponse("", "Compilation Error:\n" + compileError, false);
        }

        // Run
        Process runProcess = new ProcessBuilder("java", "Main")
                .directory(tempDir)
                .start();
        
        return waitForProcess(runProcess);
    }

    private CodeExecutionResponse runPython(String code, File tempDir) throws IOException, InterruptedException {
        File sourceFile = new File(tempDir, "main.py");
        Files.write(sourceFile.toPath(), code.getBytes());

        Process runProcess = new ProcessBuilder("python", "main.py")
                .directory(tempDir)
                .start();
        
        return waitForProcess(runProcess);
    }

    private CodeExecutionResponse runCpp(String code, File tempDir) throws IOException, InterruptedException {
        File sourceFile = new File(tempDir, "main.cpp");
        Files.write(sourceFile.toPath(), code.getBytes());

        // Compile
        Process compileProcess = new ProcessBuilder("g++", "main.cpp", "-o", "main.exe")
                .directory(tempDir)
                .start();
        
        String compileError = readStream(compileProcess.getErrorStream());
        if (!compileProcess.waitFor(10, TimeUnit.SECONDS) || compileProcess.exitValue() != 0) {
            return new CodeExecutionResponse("", "Compilation Error:\n" + compileError, false);
        }

        // Run
        Process runProcess = new ProcessBuilder(new File(tempDir, "main.exe").getAbsolutePath())
                .directory(tempDir)
                .start();
        
        return waitForProcess(runProcess);
    }

    private CodeExecutionResponse runC(String code, File tempDir) throws IOException, InterruptedException {
        File sourceFile = new File(tempDir, "main.c");
        Files.write(sourceFile.toPath(), code.getBytes());

        // Compile
        Process compileProcess = new ProcessBuilder("gcc", "main.c", "-o", "main.exe")
                .directory(tempDir)
                .start();
        
        String compileError = readStream(compileProcess.getErrorStream());
        if (!compileProcess.waitFor(10, TimeUnit.SECONDS) || compileProcess.exitValue() != 0) {
            return new CodeExecutionResponse("", "Compilation Error:\n" + compileError, false);
        }

        // Run
        Process runProcess = new ProcessBuilder(new File(tempDir, "main.exe").getAbsolutePath())
                .directory(tempDir)
                .start();
        
        return waitForProcess(runProcess);
    }

    private CodeExecutionResponse waitForProcess(Process process) throws IOException, InterruptedException {
        boolean finished = process.waitFor(10, TimeUnit.SECONDS);
        if (!finished) {
            process.destroyForcibly();
            return new CodeExecutionResponse("", "Execution Timed Out (10 seconds limit)", false);
        }

        String output = readStream(process.getInputStream());
        String error = readStream(process.getErrorStream());

        return new CodeExecutionResponse(output, error, process.exitValue() == 0);
    }

    private String readStream(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }

    private void deleteDirectory(File dir) {
        if (dir.exists()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File file : files) {
                    file.delete();
                }
            }
            dir.delete();
        }
    }
}
