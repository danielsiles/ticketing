import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@dstickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCanceledPublisher } from "../publishers/order-canceled-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { sign } from "jsonwebtoken";

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Canceled });
    await order.save();

    await new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    msg.ack();
  }
}
