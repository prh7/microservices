import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@phticketing/common';
import { Ticket } from '../models/ticket';
import { queueGroupName } from './queueGroupName';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

       ticket.set({ title: data.title, price: data.price });

       await ticket.save();

       msg.ack();
    }
}