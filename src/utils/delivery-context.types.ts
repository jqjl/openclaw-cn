import type { ChannelRouteTargetInput } from "../plugin-sdk/channel-route.js";

<<<<<<< HEAD
=======
export type DeliveryIntentRef = {
  id: string;
  kind: "outbound_queue";
  queuePolicy?: "required" | "best_effort";
};

>>>>>>> upstream/main
export type DeliveryContext = Pick<
  ChannelRouteTargetInput,
  "accountId" | "channel" | "threadId" | "to"
> & {
  channel?: string;
  to?: string;
  accountId?: string;
  threadId?: string | number;
<<<<<<< HEAD
=======
  deliveryIntent?: DeliveryIntentRef;
>>>>>>> upstream/main
};

export type DeliveryContextSessionSource = {
  channel?: string;
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
  origin?: {
    provider?: string;
    accountId?: string;
    threadId?: string | number;
  };
  deliveryContext?: DeliveryContext;
};
