import { natsWrapper } from "../../../nats-wrapper";
import { OrderCanceledListener } from "../order-canceled-listener";
import { OrderStatus, OrderCanceledEvent } from "@dstickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    version: 0,
    userId: "daoisjdpsa",
  });
  await order.save();

  const data: OrderCanceledEvent["data"] = {
    id: order.id,
    status: OrderStatus.Canceled,
    ticket: {
      id: "dadada",
    },
    version: 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, listener, data, order };
};

it("updates the status of the order", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
