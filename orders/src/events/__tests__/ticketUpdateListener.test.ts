import mongoose from "mongoose";
import { Message } from 'node-nats-streaming'
import { TicketUpdatedEvent } from "@phticketing/common";
import { TicketUpdatedListener } from "../ticketUpdatedListener";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

const setup = async () => {
    // create instance of listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20
    });
    await ticket.save();

    // Create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'New Concert',
        price: 999,
        userId: 'fasdfasf'
    };

    // creates a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, ticket, msg };
};

it('finds, updates and saves a ticket', async () => {
    const { listener, ticket, data, msg } = await setup();
    
    // call on onMessage function with data and message objects
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket is created!
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    
    // call on onMessage function with data and message objects
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket is created!
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the msg has a skipped version number', async () => {
    const { listener, data, msg } = await setup();

    data.version = 10;
    
    try {
        // call on onMessage function with data and message objects
        await listener.onMessage(data, msg);
    } catch(error) {}
    
    // write assertions to make sure a ticket is created!
    expect(msg.ack).not.toHaveBeenCalled();
});
