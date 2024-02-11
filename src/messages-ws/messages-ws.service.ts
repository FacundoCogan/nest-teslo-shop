import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { connected } from 'process';

interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: User,
    }
}

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectedClients = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async registerClient( client: Socket, userId: string ) {

        const user = await this.userRepository.findOneBy({ id: userId });
        if ( !user ) throw new Error( 'User not found' );
        if ( !user.isActive ) throw new Error( 'User is inactive, talk with an admin' );

        this.checkuserConnection( user );

        this.connectedClients[client.id] = {
            socket: client,
            user: user,
        };
    }

    removeClient( clientId: string ) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): string[] {
        return Object.keys( this.connectedClients );
    }

    getUserFullName( socketId: string ) {
        return this.connectedClients[socketId].user.fullName;
    }

    private checkuserConnection( user: User ) {

        for ( const clienteId of Object.keys( this.connectedClients ) ) {
            
            const connectedClient = this.connectedClients[clienteId];

            if ( connectedClient.user.id === user.id) {
                connectedClient.socket.disconnect();
                break;
            }

        }

    }

}
