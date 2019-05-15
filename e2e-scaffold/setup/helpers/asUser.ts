const { Client } = require("@8base/api-client");

const {
  ID_TOKEN,
  E2E_SCAFFOLD_WORKSPACE_ID,
  E2E_SCAFFOLD_SERVER_URL,
} = process.env;


export const asUser = async () => {
  const client = new Client(E2E_SCAFFOLD_SERVER_URL);

  let auth = null;

  try {
    client.setIdToken(ID_TOKEN);
    client.setWorkspaceId(E2E_SCAFFOLD_WORKSPACE_ID);

    client.request = () => Promise.resolve();
    client.importWorkspace = () => Promise.resolve();

    auth = { token: client.idToken };
  } catch (e) {
    // eslint-disable-next-line
    console.log(e);
  }

  return { auth, client };
};
