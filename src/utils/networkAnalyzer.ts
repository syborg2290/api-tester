// networkAnalyzer.ts

const { exec } = require('child_process');

// Function to make a cURL request and analyze traffic
export const analyzeTraffic = async (url: any) => {
    const startTime = new Date().getTime();

    // Make the cURL request
    const curlCommand = `curl -X GET "${url}"`;
    const stdout: any = await executeCommand(curlCommand);

    // Analyze the response and capture traffic details
    const responseData = JSON.parse(stdout);

    // const serverName = 'Apache';
    // const searchString = 'error';

    // const result = analyzeHttpResponse(stdout, serverName, searchString)

    // console.log(result);

    const responseTime = new Date().getTime() - startTime;
    const payloadSizeKB = getPayloadSizeKB(stdout);
    const statusCode = responseData.status || 200;
    const statusMessage = responseData.statusText || 'OK';

    return {
        response: responseData,
        responseTime: `${responseTime} ms`,
        payloadSize: `${payloadSizeKB} KB`,
        statusCode: statusCode,
        statusMessage: statusMessage,
    };
};

// Helper function to execute a shell command and capture stdout
export const executeCommand = (command: any) => {
    return new Promise((resolve, reject) => {
        exec(command, (error: any, stdout: any, stderr: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
};

// Helper function to calculate payload size in KB
const getPayloadSizeKB = (response: any) => {
    const payloadSize = Buffer.byteLength(response, 'utf8');
    return (payloadSize / 1024).toFixed(2);
};


