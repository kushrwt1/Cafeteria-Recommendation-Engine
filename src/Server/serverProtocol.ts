import net from "net";
export class ServerProtocol {
  static encodeRequest(
    command: string,
    headers: Record<string, string>,
    body: any,
    format: "string" | "json" | "xml"
  ): string {
    let formattedBody;
    switch (format) {
      case "json":
        formattedBody = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
        break;
      case "xml":
        formattedBody = body;
        headers["Content-Type"] = "application/xml";
        break;
      default:
        formattedBody = body.toString();
        headers["Content-Type"] = "text/plain";
        break;
    }

    const headerString = Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    return `${command}\n${headerString}\n\n${formattedBody}`;
  }

  static decodeRequest(data: string) {
    const [headerSection, body] = data.split("\n\n");
    const [command, ...headerLines] = headerSection.split("\n");
    const headers = Object.fromEntries(
      headerLines.map((line) => line.split(": ").map((part) => part.trim()))
    );
    return { command, headers, body };
  }

  static sendResponse(
    socket: net.Socket,
    command: string,
    headers: Record<string, string>,
    body: any,
    format: "string" | "json" | "xml"
  ) {
    const response = this.encodeRequest(command, headers, body, format);
    socket.write(response);
  }
}
