import { GraphqlActions, GraphqlAsyncActionsType } from '../consts/GraphqlActions';
import { Utils } from './utils';
import { AsyncStatus } from '../consts/AsyncStatus';
import { BuildController } from '../engine/controllers/buildController';
import { Context } from './context';
import { RequestOptions } from '../interfaces/Common';
import { REQUEST_HEADER_IGNORED } from '../consts/request';
import unzipper from 'unzipper';
import * as fs from 'fs';

export const executeAsync = async (
  context: Context,
  query: GraphqlAsyncActionsType,
  variables: { [key: string]: any } = {},
  options?: RequestOptions,
) => {
  const {
    system: {
      async: { sessionId },
    },
  } = await context.request(query, variables, options);

  let result;
  do {
    result = (
      await context.request(
        GraphqlActions.asyncSessionStatus,
        { sessionId },
        {
          customEnvironment: REQUEST_HEADER_IGNORED,
          customWorkspaceId: REQUEST_HEADER_IGNORED,
          customAuthorization: REQUEST_HEADER_IGNORED,
        },
      )
    ).status;

    context.logger.debug(result);
    await Utils.sleep(2000);
    context.spinner.stop();
    context.spinner.start(
      context.i18n.t('async_in_progress', {
        status: result.status,
        message: result.message || '',
      }),
    );
  } while (result.status !== AsyncStatus.completeSuccess && result.status !== AsyncStatus.completeError);

  context.spinner.stop();

  if (result.status === AsyncStatus.completeError) {
    let gqlError;
    try {
      gqlError = JSON.parse(result.message); // result.message contains valid gqlError, should be thrown as is
    } catch (e) {
      throw new Error(result.message);
    }
    throw gqlError;
  }

  if (result.message) {
    context.logger.info(result.message);
  }
};

export const uploadProject = async (context: Context, options?: RequestOptions): Promise<{ buildName: string }> => {
  const buildDir = await BuildController.package(context);
  context.logger.debug(`build dir: ${buildDir}`);

  const { prepareDeploy } = await context.request(GraphqlActions.prepareDeploy, {}, options);

  await Utils.upload(prepareDeploy.uploadBuildUrl, buildDir.build, context);
  context.logger.debug('upload source code complete');
  return { buildName: prepareDeploy.buildName };
};

export const downloadProject = async (context: Context, path: string, options?: RequestOptions): Promise<any> => {
  const { prepareDownload } = await context.request(GraphqlActions.prepareDownload, {}, options);
  // Decode the base64 contenthow
  const decodedContent = Buffer.from(prepareDownload.downloadMetaDataUrl.content, 'base64');

  context.logger.debug('download succesfully, writing to file and unziping');
  const unzipPath = `${path}/${prepareDownload.downloadMetaDataUrl.key}`;
  fs.writeFileSync(unzipPath, decodedContent);
  try {
    await unzipper.Open.file(unzipPath).then(async d => {
      await d.extract({ path: path, concurrency: 5 });
    });

    fs.unlinkSync(unzipPath);

    if (fs.existsSync(`${path}/__migration_handler`)) {
      fs.rmSync(`${path}/__migration_handler`, { recursive: true });
    }

    if (fs.existsSync(`${path}/___source_migrations`)) {
      fs.rmSync(`${path}/___source_migrations`, { recursive: true });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ file: execute.ts:90 ~ downloadProject ~ error:', error);
  }
};

export const executeDeploy = async (context: Context, deployOptions: any, options?: RequestOptions) => {
  context.spinner.start(context.i18n.t('deploy_in_progress', { status: 'prepare to upload', message: '' }));

  const buildDir = await BuildController.package(context);
  context.logger.debug(`build dir: ${buildDir}`);

  const { prepareDeploy } = await context.request(GraphqlActions.prepareDeploy, null, options);

  await Utils.upload(prepareDeploy.uploadMetaDataUrl, buildDir.meta, context);
  context.logger.debug('upload meta data complete');

  await Utils.upload(prepareDeploy.uploadBuildUrl, buildDir.build, context);
  context.logger.debug('upload source code complete');

  await context.request(
    GraphqlActions.deploy,
    { data: { buildName: prepareDeploy.buildName, options: deployOptions } },
    options,
  );

  let result;
  do {
    result = (
      await context.request(GraphqlActions.deployStatus, {
        buildName: prepareDeploy.buildName,
      })
    ).deployStatus;
    context.logger.debug(result);
    await Utils.sleep(2000);
    context.spinner.stop();
    context.spinner.start(
      context.i18n.t('deploy_in_progress', {
        status: result.status,
        message: result.message || '',
      }),
    );
  } while (result.status !== AsyncStatus.completeSuccess && result.status !== AsyncStatus.completeError);

  await BuildController.clearBuild(context);
  context.spinner.stop();

  if (result.status === AsyncStatus.completeError) {
    let gqlError;
    try {
      gqlError = JSON.parse(result.message); // result.message contains valid gqlError, should be thrown as is
    } catch (e) {
      throw new Error(result.message);
    }
    throw gqlError;
  }
};
