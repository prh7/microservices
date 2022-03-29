import { Subjects } from './subjects';
import { OrderStatus } from './types/orderStatus';

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated,
    data: {
        id: string;
        status: OrderStatus,
        version: number;
        userId: string;
        expiresAt: string;
        ticket: {
            id: string;
            price: number;
        };
    };
}