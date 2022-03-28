import mongoose from "mongoose";
import { Message } from 'node-nats-streaming'
import { TicketCreatedEvent } from "@phticketing/common";
import { TicketCreatedListener } from "../ticketCreatedListener";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

const setup = async () => {
    // create instance of listener
    const listener = new TicketCreatedListener(natsWrapper.client)

    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // creates a fake object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
    const { listener, data, msg }= await setup();
    
    // call on onMessage function with data and message objects
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket is created!
    const ticket = await Ticket.findById(data.id);

    expect(data).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg }= await setup();
    
    // call on onMessage function with data and message objects
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket is created!
    expect(msg.ack).toHaveBeenCalled();
});