import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PubSub, Topic, Subscription } from '@google-cloud/pubsub';

@Injectable()
export class PubSubService implements OnModuleInit, OnModuleDestroy {
    private pubsub: PubSub;
    private readonly logger = new Logger(PubSubService.name);

    constructor() {
        // Em dev local, você pode usar o emulador definindo a env PUBSUB_EMULATOR_HOST
        this.pubsub = new PubSub({
            projectId: process.env.GCP_PROJECT_ID,
        });
    }

    onModuleInit() {
        this.logger.log('Google Cloud Pub/Sub conectado.');
    }

    // Publica uma mensagem no tópico do GCP
    async publish(topicName: string, data: Record<string, any>): Promise<string> {
        const topic: Topic = this.pubsub.topic(topicName);

        // Garante que o tópico existe (se não existir, o GCP cria automaticamente)
        const [exists] = await topic.exists();
        if (!exists) {
            await topic.create();
            this.logger.log(`Tópico criado automaticamente: ${topicName}`);
        }

        const dataBuffer = Buffer.from(JSON.stringify(data));
        const messageId = await topic.publishMessage({ data: dataBuffer });
        this.logger.log(`Mensagem ${messageId} enviada para o tópico: ${topicName}`);
        return messageId;
    }

    // Escuta uma Subscription do GCP
    async subscribe(subscriptionName: string, topicName: string, onMessage: (data: any) => Promise<void>) {
        const subscription: Subscription = this.pubsub.subscription(subscriptionName);

        const [exists] = await subscription.exists();
        if (!exists) {
            // Cria a subscription vinculando ao tópico caso ela não exista
            await this.pubsub.topic(topicName).createSubscription(subscriptionName);
            this.logger.log(`Subscription criada automaticamente: ${subscriptionName}`);
        }

        subscription.on('message', async (message) => {
            try {
                const parsedData = JSON.parse(message.data.toString());
                await onMessage(parsedData);
                message.ack();
            } catch (error) {
                this.logger.error(`Erro ao processar mensagem ${message.id}:`, error);
                message.nack();
            }
        });

        this.logger.log(`Escutando subscription: ${subscriptionName}`);
    }

    async onModuleDestroy() {
        await this.pubsub.close();
    }
}