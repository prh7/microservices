import { Publisher, Subjects, TicketCreatedEvent } from '@phticketing/common';

export class TickeCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}