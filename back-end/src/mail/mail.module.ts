import { Module } from '@nestjs/common';
import { MailConsumer } from './mail.consumer.js';
import { PubSubModule } from '../providers/pubsub/pubsub.module.js';

@Module({
    imports: [PubSubModule],
    providers: [MailConsumer],
})
export class MailModule { }