import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GoGoAnimeRunner } from './go-go-anime.runner';

@WebSocketGateway()
export class GoGoAnimeGateWay implements OnGatewayInit {
  constructor(private readonly runner: GoGoAnimeRunner) {}

  afterInit(server: Server) {
    this.runner.getEvent().subscribe(d => {
      server.emit('events', d);
    });
  }
}
