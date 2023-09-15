const { exec } = require('child_process');
const path = require('path');

export const executeGo = (goFilePath: string, filename: string, parameters: any): Promise<string> => {
    const fullGoFilePath = path.resolve(__dirname, '..', '..', goFilePath);

    return new Promise((resolve, reject) => {
        // Compile the Go source file
        exec(`cd ${fullGoFilePath} && go build ${filename}`, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.error(`Error compiling Go code: ${error}`);
                reject(error);
                return;
            }

            // Execute the compiled binary
            const binaryPath = path.join(fullGoFilePath, filename.replace('.go', ''));
            exec(binaryPath + " " + parameters, (error: any, stdout: any, stderr: any) => {
                if (error) {
                    console.error(`Error executing compiled binary: ${error}`);
                    reject(error);
                    return;
                }

                // console.log(`Go program output:\n${stdout}`);
                resolve(stdout);
            });
        });
    });
};
