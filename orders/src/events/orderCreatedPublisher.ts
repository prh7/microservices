import { Publisher, OrderCreatedEvent, Subjects } from "@phticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}