import type { Request, Response } from "express";

const express = require('express');
const multer = require('multer');
const DOMPurify = require('dompurify');
const { analyzeTraffic } = require('../utils/networkAnalyzer');
const router = express.Router();

const { exec } = require('child_process');

router.get('/make-curl-request-get', async (req: any, res: any) => {
    const protocol = req.query("protocol")
    const host = req.query['host'];

    const url = `${protocol}://${host}`;
    try {
        const analysisResult = await analyzeTraffic(url);

        res.status(analysisResult.statusCode).json(analysisResult);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'An error occurred while analyzing traffic',
        });
    }
});


router.post('/make-curl-request-post', (req: any, res: any) => {
    const curlCommand = 'curl -X POST "http://192.168.1.42:3001/catogry" -H "Content-Type: application/json" -H "Authorization: Bearer your-access-token" -d \'{"key1": "value1", "key2": "value2"}\'';


    exec(curlCommand, (error: any, stdout: any, stderr: any) => {
        if (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({
                error: 'An error occurred while making the cURL request.'
            });
            return;
        }

        // Assuming the response is JSON
        const responseData = JSON.parse(stdout);
        res.json(responseData);
    });
});


router.get('/make-curl-request-get-test', (req: any, res: any) => {
    const startTime = new Date().getTime();

    // Validate and sanitize input
    const postId = req.query['postId'] || '1'; // Default to postId '1' if not provided
    if (!Number.isInteger(Number(postId)) || Number(postId) < 1) {
        res.status(400).json({
            error: 'Invalid postId provided.',
        });
        return;
    }

    // Construct the curl command with sanitized input
    const curlCommand = `curl -X GET "https://jsonplaceholder.typicode.com/posts/${postId}"`;

    exec(curlCommand, (error: any, stdout: any, stderr: any) => {
        const endTime = new Date().getTime();
        const responseTime = endTime - startTime;

        if (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({
                error: 'An error occurred while making the cURL request.'
            });
            return;
        }

        // Assuming the response is JSON
        const responseData = JSON.parse(stdout);

        // responseParser(responseData);

        // Get the payload size from the response and format it in KB
        const payloadSize = Buffer.byteLength(stdout, 'utf8');
        const payloadSizeKB = (payloadSize / 1024).toFixed(2); // Convert bytes to KB

        // Format the response time in ms
        const formattedResponseTime = responseTime + ' ms';

        // Include status code and message from the cURL response
        const statusCode = responseData.status || 200;
        const statusMessage = responseData.statusText || 'OK';



        // Send the response with all the formatted details
        res.status(statusCode).json({
            response: DOMPurify.sanitize(responseData),
            responseTime: formattedResponseTime,
            payloadSize: payloadSizeKB + ' KB',
            statusCode: statusCode,
            statusMessage: statusMessage,
        });
    });
});

// Initialize multer with appropriate storage options
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

router.post('/analyze-traffic', upload.none(), async (req: Request, res: Response) => {
    const { protocol, host, path, method, headers, query, body } = req.body;

    // Format the headers object as a single string
    const formattedHeaders = Object.keys(headers)
        .map((key) => `"${key}: ${headers[key]}"`)
        .join(' ');

    // Format the query object as a single string
    const formattedQuery = Object.keys(query)
        .map((key) => `"${key}: ${query[key]}"`)
        .join(' ');


    // Construct the cURL command based on the request details and headers
    const curlCommand = body != null ? `curl -X ${method} "${protocol}://${host}${path}?${formattedQuery}" -H ${formattedHeaders} -d '${JSON.stringify(body)}'` :
        `curl -X ${method} "${protocol}://${host}${path}?${formattedQuery}" -H ${formattedHeaders}'`;

    try {
        // Capture packets for a specified duration (e.g., 10 seconds)
        // await capturePackets(10);

        // Analyze captured packets
        // analyzePackets();

        // Make the cURL request
        exec(curlCommand, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.error(`Error: ${error}`);
                res.status(500).json({
                    error: 'An error occurred while making the cURL request.'
                });
                return;
            }

            console.log(stdout);

            // Assuming the response is JSON
            const responseData = JSON.parse(stdout);
            res.json(responseData);
        });


    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'An error occurred while analyzing traffic',
        });
    }
});

module.exports = router;
