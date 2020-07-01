import { Subjects, TicketUpdatedEvent, Publisher } from "@dstickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
