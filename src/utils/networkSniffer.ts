// networkSniffer.ts

const { spawn } = require('child_process');

// Function to capture network packets using tcpdump
export const capturePackets = async (durationInSeconds: any) => {
    const tcpdump = spawn('tcpdump', ['-i', 'your_network_interface', '-w', 'captured.pcap']);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            tcpdump.kill();
            resolve('Packets captured');
        }, durationInSeconds * 1000);
    });
};

// Function to analyze captured packets using tcpdump
export const analyzePackets = () => {
    const analyze = spawn('tcpdump', ['-r', 'captured.pcap']);
    analyze.stdout.pipe(process.stdout);
};

// Function to perform a cURL request using child process
export const makeCurlRequest = (curlCommand: any) => {
    const curl = spawn('sh', ['-c', curlCommand]);
    curl.stdout.pipe(process.stdout);
};


