/**
 * Code Executor Service using Local Compilers
 * 
 * This service compiles and executes code using locally installed compilers.
 * Required: gcc, g++, python3, javac/java in system PATH
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Execution limits
const DEFAULT_TIMEOUT = 5000;  // 5 seconds
const MAX_OUTPUT_SIZE = 65536; // 64KB

// Compiler configurations for each language
// Using command names to rely on system PATH
const GCC_PATH = 'C:\\dev-tools\\mingw64\\bin\\gcc.exe';
const GPP_PATH = 'C:\\dev-tools\\mingw64\\bin\\g++.exe';
const JAVA_PATH = 'java';
const JAVAC_PATH = 'javac';

const LANGUAGE_CONFIG = {
    'C': {
        extension: '.c',
        compile: (srcFile, outFile) => [GCC_PATH, [srcFile, '-o', outFile]],
        run: (outFile) => [outFile, []],
        needsCompile: true
    },
    'C++': {
        extension: '.cpp',
        compile: (srcFile, outFile) => [GPP_PATH, [srcFile, '-o', outFile]],
        run: (outFile) => [outFile, []],
        needsCompile: true
    },
    'Java': {
        extension: '.java',
        compile: (srcFile, outDir) => [JAVAC_PATH, ['-d', outDir, srcFile]],
        run: (outDir, className) => [JAVA_PATH, ['-cp', outDir, className]],
        needsCompile: true,
        extractClassName: (code) => {
            const match = code.match(/public\s+class\s+(\w+)/);
            return match ? match[1] : 'Main';
        }
    },
    'Python': {
        extension: '.py',
        run: (srcFile) => ['python', [srcFile]],
        needsCompile: false
    }
};

/**
 * Generate a unique temp directory for execution
 */
async function createTempDir() {
    const tempBase = os.tmpdir();
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const tempDir = path.join(tempBase, `code_exec_${uniqueId}`);
    await fs.mkdir(tempDir, { recursive: true });
    return tempDir;
}

/**
 * Clean up temp directory
 */
async function cleanupTempDir(tempDir) {
    try {
        const files = await fs.readdir(tempDir);
        for (const file of files) {
            await fs.unlink(path.join(tempDir, file)).catch(() => { });
        }
        await fs.rmdir(tempDir).catch(() => { });
    } catch (err) {
        // Ignore cleanup errors
    }
}

/**
 * Run a command with timeout
 */
function runCommand(command, args, options = {}) {
    return new Promise((resolve) => {
        const { input = '', timeout = DEFAULT_TIMEOUT, cwd } = options;

        let stdout = '';
        let stderr = '';
        let killed = false;

        // Extend PATH to include MinGW bin for gcc/g++ to find required DLLs
        const extendedEnv = {
            ...process.env,
            PATH: `C:\\dev-tools\\mingw64\\bin;${process.env.PATH || ''}`
        };

        const proc = spawn(command, args, {
            cwd,
            windowsHide: true,  // Hide console window on Windows
            env: extendedEnv
        });

        // Set timeout
        const timer = setTimeout(() => {
            killed = true;
            proc.kill('SIGKILL');
        }, timeout);

        // Handle stdin
        if (input) {
            proc.stdin.write(input);
            proc.stdin.end();
        } else {
            proc.stdin.end();
        }

        // Capture stdout
        proc.stdout.on('data', (data) => {
            if (stdout.length < MAX_OUTPUT_SIZE) {
                stdout += data.toString();
            }
        });

        // Capture stderr
        proc.stderr.on('data', (data) => {
            if (stderr.length < MAX_OUTPUT_SIZE) {
                stderr += data.toString();
            }
        });

        proc.on('close', (code) => {
            clearTimeout(timer);
            resolve({
                success: code === 0 && !killed,
                code,
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                killed
            });
        });

        proc.on('error', (err) => {
            clearTimeout(timer);
            resolve({
                success: false,
                code: -1,
                stdout: '',
                stderr: err.message,
                killed: false
            });
        });
    });
}

/**
 * Compile code (for compiled languages)
 */
async function compileCode(code, language, tempDir) {
    const config = LANGUAGE_CONFIG[language];
    if (!config) {
        return { success: false, errors: [`Unsupported language: ${language}`] };
    }

    if (!config.needsCompile) {
        return { success: true, errors: [] };
    }

    // Determine filenames
    let srcFileName, outFileName;

    if (language === 'Java') {
        const className = config.extractClassName(code);
        srcFileName = `${className}${config.extension}`;
        outFileName = tempDir; // Java outputs to directory
    } else {
        srcFileName = `code${config.extension}`;
        outFileName = path.join(tempDir, process.platform === 'win32' ? 'code.exe' : 'code');
    }

    const srcFile = path.join(tempDir, srcFileName);

    // Write source code
    await fs.writeFile(srcFile, code);

    // Compile
    const [cmd, args] = config.compile(srcFile, outFileName);
    const result = await runCommand(cmd, args, { cwd: tempDir, timeout: 10000 });

    if (!result.success) {
        return {
            success: false,
            errors: [result.stderr || `Compilation failed with code ${result.code}`]
        };
    }

    return { success: true, errors: [], outFile: outFileName };
}

/**
 * Execute compiled/interpreted code
 */
async function executeCode(code, language, stdin = '', timeout = DEFAULT_TIMEOUT) {
    const config = LANGUAGE_CONFIG[language];
    if (!config) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const tempDir = await createTempDir();

    try {
        // Compile if needed
        if (config.needsCompile) {
            const compileResult = await compileCode(code, language, tempDir);
            if (!compileResult.success) {
                return {
                    success: false,
                    statusId: 6, // Compilation Error
                    statusDescription: 'Compilation Error',
                    stdout: '',
                    stderr: '',
                    compileOutput: compileResult.errors.join('\n'),
                    time: 0,
                    memory: 0
                };
            }
        } else {
            // Write source file for interpreted languages
            const srcFile = path.join(tempDir, `code${config.extension}`);
            await fs.writeFile(srcFile, code);
        }

        // Determine run command
        let cmd, args;
        if (language === 'Java') {
            const className = config.extractClassName(code);
            [cmd, args] = config.run(tempDir, className);
        } else if (language === 'Python') {
            const srcFile = path.join(tempDir, `code${config.extension}`);
            [cmd, args] = config.run(srcFile);
        } else {
            const outFile = path.join(tempDir, process.platform === 'win32' ? 'code.exe' : 'code');
            [cmd, args] = config.run(outFile);
        }

        // Execute
        const startTime = Date.now();
        const result = await runCommand(cmd, args, {
            input: stdin,
            timeout,
            cwd: tempDir
        });
        const execTime = Date.now() - startTime;

        if (result.killed) {
            return {
                success: false,
                statusId: 5, // Time Limit Exceeded
                statusDescription: 'Time Limit Exceeded',
                stdout: result.stdout,
                stderr: 'Execution timed out',
                compileOutput: '',
                time: execTime / 1000,
                memory: 0
            };
        }

        if (!result.success) {
            return {
                success: false,
                statusId: 11, // Runtime Error
                statusDescription: 'Runtime Error',
                stdout: result.stdout,
                stderr: result.stderr,
                compileOutput: '',
                time: execTime / 1000,
                memory: 0
            };
        }

        return {
            success: true,
            statusId: 3, // Accepted
            statusDescription: 'Accepted',
            stdout: result.stdout,
            stderr: result.stderr,
            compileOutput: '',
            time: execTime / 1000,
            memory: 0
        };

    } finally {
        // Cleanup
        await cleanupTempDir(tempDir);
    }
}

/**
 * Run code against multiple test cases
 */
async function runTestCases(code, language, testCases) {
    const results = [];
    let passedCount = 0;
    let compilationError = null;

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        try {
            const result = await executeCode(code, language, testCase.input);

            // Check for compilation error (only on first test)
            if (result.statusId === 6) { // Compilation Error
                compilationError = result.compileOutput || result.stderr;
                break;
            }

            const passed = result.stdout.trim() === testCase.expectedOutput.trim();
            if (passed) passedCount++;

            results.push({
                testCaseIndex: i,
                passed,
                actualOutput: result.stdout,
                expectedOutput: testCase.expectedOutput,
                executionTime: parseFloat(result.time) * 1000, // Convert to ms
                error: result.stderr || null
            });
        } catch (error) {
            results.push({
                testCaseIndex: i,
                passed: false,
                actualOutput: '',
                expectedOutput: testCase.expectedOutput,
                executionTime: 0,
                error: error.message
            });
        }
    }

    // Determine overall status
    let status;
    if (compilationError) {
        status = 'compilation_error';
    } else if (passedCount === testCases.length) {
        status = 'accepted';
    } else if (passedCount > 0) {
        status = 'partial';
    } else {
        status = 'wrong_answer';
    }

    return {
        compilationResult: {
            success: !compilationError,
            errors: compilationError ? [compilationError] : [],
            output: ''
        },
        testResults: results,
        passedTests: passedCount,
        totalTests: testCases.length,
        status
    };
}

/**
 * Compile code only (check for syntax errors)
 */
async function compileOnly(code, language) {
    const config = LANGUAGE_CONFIG[language];
    if (!config) {
        return { success: false, errors: [`Unsupported language: ${language}`] };
    }

    const tempDir = await createTempDir();

    try {
        if (config.needsCompile) {
            return await compileCode(code, language, tempDir);
        } else {
            // For Python, try to compile to bytecode
            const srcFile = path.join(tempDir, `code${config.extension}`);
            await fs.writeFile(srcFile, code);

            const result = await runCommand('python', ['-m', 'py_compile', srcFile], {
                cwd: tempDir,
                timeout: 5000
            });

            return {
                success: result.success,
                errors: result.success ? [] : [result.stderr]
            };
        }
    } finally {
        await cleanupTempDir(tempDir);
    }
}

module.exports = {
    executeCode,
    runTestCases,
    compileOnly,
    compileCode,
    LANGUAGE_CONFIG
};
