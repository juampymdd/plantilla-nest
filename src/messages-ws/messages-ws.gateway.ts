import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}
  
  
  async handleConnection( client: Socket ) {
    const token = client.handshake.headers.authorization as string;
    let payload: JwtPayload; 
    try{
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient( client, payload.id );

      console.log("payload", payload)
    }catch(error){
      client.disconnect();
      return 
    }
    
    
    this.server.emit('clients-updated', this.messagesWsService.getConnectedClients() )
    // console.log({ connectedClients: this.messagesWsService.getConnectedClients() })

  }

  handleDisconnect( client: Socket ) {

    this.messagesWsService.removeClient( client.id );

    // console.log({ connectedClients: this.messagesWsService.getConnectedClients() })
    this.server.emit('clients-updated', this.messagesWsService.getConnectedClients() )
  }

  // message-from-client

  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    console.log({ payload })
    //! emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo',
    //   message: payload.message || 'No message',
    // });

    //! emite a todos menos al cliente inicial
    client.broadcast.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName( client.id ),
      message: payload.message || 'No message',
    });
  }
}
