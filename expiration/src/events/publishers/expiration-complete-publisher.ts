import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@dstickets/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
