import { Global, Module } from '@nestjs/common';
import { PubSubService } from './pubsub.service.js';

@Global() // Opcional: torna global para não precisar importar em todo lugar
@Module({
    providers: [PubSubService],
    exports: [PubSubService],
})
export class PubSubModule { }