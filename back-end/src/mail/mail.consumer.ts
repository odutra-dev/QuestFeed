import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PubSubService } from '../providers/pubsub/pubsub.service.js';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { WelcomeEmail } from './templates/welcome-email.js';

@Injectable()
export class MailConsumer implements OnModuleInit {
    private resend: Resend;
    private readonly logger = new Logger(MailConsumer.name);

    constructor(private readonly pubSubService: PubSubService) {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    onModuleInit() {
        this.pubSubService.subscribe(
            process.env.GCP_PUBSUB_USER_REGISTERED_SUB || 'user-registered-sub',
            'user-registered-topic',
            this.handleUserRegistered.bind(this),
        );
    }

    private async handleUserRegistered(payload: { email: string; name: string }) {
        this.logger.log(`Processando envio de e-mail para: ${payload.email}`);

        try {
            const html = await render(WelcomeEmail({ name: payload.name }));

            await this.resend.emails.send({
                from: 'QuestFeed <onboarding@resend.dev>',
                to: payload.email,
                subject: 'Wellcome QuestFeed!',
                html,
            });

            this.logger.log(`E-mail enviado com sucesso para ${payload.email}`);
        } catch (error) {
            this.logger.error(`Erro ao enviar e-mail para ${payload.email}:`, error);
            throw error;
        }
    }
}