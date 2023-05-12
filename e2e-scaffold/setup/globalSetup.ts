import { generateScaffoldProject } from './helpers/generateScaffoldProject';
import { startScaffoldProject } from './helpers/startScaffoldProject';

import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as os from 'os';
import * as path from 'path';
import * as dotenv from 'dotenv';
import gql from 'graphql-tag';
import { Client } from '@8base/api-client';

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

dotenv.config();

const {
  E2E_SCAFFOLD_SERVER_URL,
  E2E_SCAFFOLD_GENERATE,
  E2E_SCAFFOLD_DEBUG,
  E2E_SCAFFOLD_EMAIL,
  E2E_SCAFFOLD_PASSWORD,
} = process.env;

const USER_LOGIN_QUERY = gql`
  mutation Login($data: UserLoginInput!) {
    userLogin(data: $data) {
      auth {
        idToken
      }
      workspaces {
        workspace
      }
    }
  }
`;

const getPuppeteerLaunchOptions = () => {
  if (E2E_SCAFFOLD_DEBUG === 'true') {
    return {
      headless: false,
      slowMo: 100,
      args: ['--start-fullscreen', '--auto-open-devtools-for-tabs'],
      env: {
        TZ: 'America/New_York',
      },
    };
  }

  return {
    args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
    env: {
      TZ: 'America/New_York',
    },
  };
};

export default async () => {
  try {
    if (E2E_SCAFFOLD_GENERATE === 'true') {
      await generateScaffoldProject();
      await startScaffoldProject();
    }

    const launchOptions = getPuppeteerLaunchOptions();

    const browser = await puppeteer.launch(launchOptions);

    mkdirp.sync(DIR);
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());

    global.__BROWSER__ = browser;

    const client = new Client(E2E_SCAFFOLD_SERVER_URL);

    const { userLogin } = await client.request(USER_LOGIN_QUERY, {
      data: {
        email: E2E_SCAFFOLD_EMAIL,
        password: E2E_SCAFFOLD_PASSWORD,
      },
    });

    if (userLogin.workspaces.length === 0) {
      throw new Error("Your account hasn't workspaces. Please provide another account.");
    }

    process.env.ID_TOKEN = userLogin.auth.idToken;
  } catch (err) {
    console.log(err);
  }
};
