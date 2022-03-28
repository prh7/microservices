import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from "@phticketing/common";
import { natsWrapper } from "../../../natsWrapper";
import { Order } from '../../../models/order';
import { OrderCancelledListener } from '../orderCancelledListener';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'fasdfasd',
        version: 0
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: { 
            id: 'fdsafa',
            price: 10
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { order, data, listener, msg };
};

it('updates the status of the order', async () => {
    const { order, data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    const updateOrder = await Order.findById(order.id);

    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { order, data, listener, msg } = await setup();

    await listener.onMessage(data, msg);


    expect(msg.ack).toHaveBeenCalled();
});

