import { Subjects, TicketCreatedEvent, Publisher } from "@dstickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
