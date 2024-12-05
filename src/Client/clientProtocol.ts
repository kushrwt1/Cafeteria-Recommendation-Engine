import net from 'net';

export class ClientProtocol {
    // This method is doing serialization
    static encodeRequest(command: string, headers: Record<string, string>, body: any, format: 'string' | 'json' | 'xml'): string {
        try {
            let formattedBody;
            switch (format) {
                case 'json':
                    formattedBody = JSON.stringify(body);
                    headers['Content-Type'] = 'application/json';
                    break;
                case 'xml':
                    // Convert body to XML string (you might need a library for this)
                    formattedBody = body;  // Placeholder for actual XML conversion
                    headers['Content-Type'] = 'application/xml';
                    break;
                default:
                    formattedBody = body.toString();
                    headers['Content-Type'] = 'text/plain';
                    break;
            }

            const headerString = Object.entries(headers)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');

            return `${command}\n${headerString}\n\n${formattedBody}`;
        } catch (error) {
            console.error(`Error encoding request: ${error}`);
            throw new Error('Failed to encode request');
        }
    }

    // This method is doing deserialization
    static decodeRequest(data: string) {
        try {
            const [headerSection, body] = data.split('\n\n');
            const [command, ...headerLines] = headerSection.split('\n');
            const headers = Object.fromEntries(
                headerLines.map(line => line.split(': ').map(part => part.trim()))
            );
            return { command, headers, body };
        } catch (error) {
            console.error(`Error decoding request: ${error}`);
            throw new Error('Failed to decode request');
        }
    }

    static sendRequest(socket: net.Socket, command: string, headers: Record<string, string>, body: any, format: 'string' | 'json' | 'xml') {
        try {
            const request = this.encodeRequest(command, headers, body, format);
            socket.write(request);
        } catch (error) {
            console.error(`Error sending request: ${error}`);
            // Optionally, you can handle or propagate the error further.
        }
    }
}
