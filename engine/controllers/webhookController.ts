import {
  RelativeWebhookDefinition,
  StaticConfig,
  ResolvedRelativeWebhookDefinition
} from "../../common";

import * as url from "url";

export class WebhookController {

  static resolve(webhooks: RelativeWebhookDefinition[]): RelativeWebhookDefinition[] {
    return webhooks.map<RelativeWebhookDefinition>(w => WebhookController.resolveSingle(w));
  }

  static resolveSingle(webhook: RelativeWebhookDefinition): ResolvedRelativeWebhookDefinition {
    return {
      ...webhook,
      resolvedAccountRelativePath: url.resolve(StaticConfig.remoteAddress, webhook.accountRelativePath)
    };
  }
}