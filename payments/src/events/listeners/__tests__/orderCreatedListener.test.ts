import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from "@phticketing/common";
import { natsWrapper } from "../../../natsWrapper";
import { OrderCreatedListener } from "../orderCreatedListener";
import { Order } from '../../../models/order';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'fasfa',
        userId: 'fasdfa',
        status: OrderStatus.Created,
        ticket: { 
            id: 'fdsafa',
            price: 10
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, listener, msg };
};

it('replicates the order info', async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

