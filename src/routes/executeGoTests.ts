const express = require('express');
const router = express.Router();

const { executeGo } = require('../utils/executeGo');


router.post('/execute-hello-go', async (req: any, res: any) => {
    const output = await executeGo('libs/hello', 'hello.go', null);

    res.json(output);
});

router.post('/vulnerability-scan-xss', async (req: any, res: any) => {
    try {
        const parameters = ['https://github.com/bkimminich/juice-shop'].join(' ');
        const output = await executeGo('libs/vulnerability-scanners', 'xss-vulnerability-scanner.go', [parameters]);

        const response = {
            scan_results: output.split('\n')
        };

        console.log('Vulnerability scanner output:', output);
        res.json(response);
    } catch (error) {
        console.error(error)
    }
})

router.post('/vulnerability-scan-sql-injection', async (req: any, res: any) => {
    try {
        const parameters = ['https://github.com/WebGoat'].join(' ');
        const output = await executeGo('libs/vulnerability-scanners', 'sql-injection-vulnerabilities.go', [parameters]);

        const response = {
            scan_results: output.split('\n')
        };

        console.log('Vulnerability scanner output:', output);
        res.json(response);
    } catch (error) {
        console.error(error)
    }
})


router.post('/dos-sttack-test', async (req: any, res: any) => {
    try {
        const parameters = ['https://example.com'].join(' ');
        const output = await executeGo('libs/dos-attack', 'simple-dos-sttack.go', [parameters]);

        const response = {
            scan_results: output.split('\n')
        };

        console.log('Vulnerability scanner output:', output);
        res.json(response);
    } catch (error) {
        console.error(error)
    }
})


router.post('/port-scanner', async (req: any, res: any) => {
    const parameters = ['100', '2:81', 'scanme.nmap.org'].join(' ');

    console.log('Executing port scanner with parameters:', parameters);

    try {
        const output = await executeGo('libs/port-scanner', 'dynamicPortScanner.go', [parameters]);

        console.log('Port scanner output:', output);

        // Split the output based on the "List of open ports ->" separator
        const [portsSection, openPortsSection] = output.split('List of open ports ->');

        // Extract the list of open ports from the openPortsSection
        const openPorts = openPortsSection
            .trim()
            .replace('[', '')
            .replace(']', '')
            .split(' ')
            .map(Number);

        const response = {
            ports: openPorts.filter((port: any) => port !== 0), // Remove 0 ports
        };

        res.json(response);
    } catch (error) {
        console.error('Error executing port scanner:', error);
        res.status(500).json({
            error: 'An error occurred while executing the port scanner.',
        });
    }
});


module.exports = router;