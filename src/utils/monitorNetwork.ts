import { spawn } from 'child_process';
import { executeCommand } from './networkAnalyzer';
const path = require('path');

export const startNetworkMonitor = async () => {

    try {
        const goProgramDirPath = path.resolve(__dirname, '..', '..', 'libs/network-monitor');
        const goProgramPath = path.resolve(__dirname, '..', '..', 'libs/network-monitor', 'main.go');

        // Grant execute permissions to the Go program
        await executeCommand(`chmod +x ${goProgramPath}`);
        // Compile the Go source file
        await executeCommand(`cd ${goProgramDirPath} && go build main.go`)

        const goProcess = spawn(`${goProgramPath}`);

        // Listen to the output of the Go program
        goProcess.stdout.on('data', (data: any) => {
            console.log(`Network monitor program output: ${data.toString()}`);
        });

        goProcess.stderr.on('data', (data: any) => {
            console.error(`Error: ${data.toString()}`);
        });

        goProcess.on('error', (error: any) => {
            console.log(`Network monitor program exited with error :: ${error}`);
        });

        goProcess.on('close', (code: any) => {
            console.log(`Network monitor program exited with code ${code}`);
        });

    } catch (error) {
        console.error(error)
    }

};
