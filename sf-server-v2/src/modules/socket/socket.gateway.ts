import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { ALLOWED_ORIGIN } from 'src/constants';

// ws://localhost:${port}/${namespace}
@WebSocketGateway(81, {
  namespace: 'socket',
  cors: { origin: ALLOWED_ORIGIN },
})
export class SocketGateway implements OnGatewayInit {
  constructor(private socketService: SocketService) { }

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  handleConnection(client: Socket) {
    const userId = this.extractUserId(client);
    if (userId) {
      this.socketService.registerUser(userId, client.id);
    }
  }

  handleDisconnect(client: Socket) {
    this.socketService.removeUser(client.id);
  }

  private extractUserId(client: Socket): string {
    return client.handshake.query.userId as string;
  }
}
