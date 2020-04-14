import { GraphqlActions, GraphqlAsyncActionsType } from "../consts/GraphqlActions";
import { Utils } from "./utils";
import { AsyncStatus } from "../consts/AsyncStatus";
import { BuildController } from "../engine/controllers/buildController";
import { Context } from "./context";

export const executeAsync = async (context: Context, query: GraphqlAsyncActionsType, variables: {[key: string]: any}) => {

  const { system: { async: { sessionId } } }  = await context.request(query, variables);

  let result;
  do {
    result = (
      await context.request(GraphqlActions.asyncSessionStatus, { sessionId })
    ).status;
    context.logger.debug(result);
    await Utils.sleep(2000);
    context.spinner.stop();
    context.spinner.start(
      context.i18n.t('async_in_progress', {
        status: result.status,
        message: result.message,
      }),
    );
  } while (result.status !== AsyncStatus.completeSuccess && result.status !== AsyncStatus.completeError);

  if (result.status === AsyncStatus.completeError) {
    let gqlError;
    try {
      gqlError = JSON.parse(result.message); // result.message contains valid gqlError, should be threw as is
    } catch (e) {
      throw new Error(result.message);
    }
    throw gqlError;
  }
}
