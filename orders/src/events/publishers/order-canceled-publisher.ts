import { Publisher, OrderCanceledEvent, Subjects } from "@dstickets/common";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
}
