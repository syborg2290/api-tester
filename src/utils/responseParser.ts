interface ResponseAnalysis {
    statusCode: string;
    headers: Map<string, string>;
    containsServer: boolean;
    containsError: boolean;
}

export const analyzeHttpResponse = (response: string, serverName: string, searchString: string): ResponseAnalysis => {
    const statusLine = response.split('\r\n')[0];
    const statusCode = statusLine?.split(' ')[1]!;

    const headersMap = new Map<string, string>();
    const headerText = response.split('\r\n\r\n')[0];
    const headerLines = headerText!.split('\r\n').slice(1); // Skip status line
    for (const line of headerLines!) {
        const [key, value] = line.split(': ', 2);
        if (key && value) {
            headersMap.set(key, value);
        }
    }

    const serverHeader = headersMap.get('Server') || '';
    const containsServer = serverHeader.includes(serverName);

    const containsError = response.includes(searchString);

    return {
        statusCode,
        headers: headersMap,
        containsServer,
        containsError,
    };
}

// Example usage
// const httpResponse = `
//   HTTP/1.1 200 OK
//   Server: Apache/2.4.41 (Ubuntu)
//   Content-Type: text/html; charset=utf-8
  
//   Hello, World!`;

// const serverName = 'Apache';
// const searchString = 'error';

// const analysis = analyzeHttpResponse(httpResponse, serverName, searchString);

// console.log('Response Status Code:', analysis.statusCode);
// console.log('Response Headers:', analysis.headers);
// console.log(`Contains "${serverName}" Server:`, analysis.containsServer);
// console.log(`Contains "${searchString}":`, analysis.containsError);
