import { Publisher, OrderCreatedEvent, Subjects } from "@dstickets/common";

export class OrderCreatePublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
