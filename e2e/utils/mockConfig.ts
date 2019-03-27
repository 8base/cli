
import * as fs from "fs-extra";
import * as path from "path";

const eightBaseRc = `
{
  "server-address": "https://api.8base.com",
  "auth-domain": "auth.8base.com",
  "auth-client-id": "qGHZVu5CxY5klivm28OPLjopvsYp0baD",
  "workspaces": [
    {
      "name": "p's Workspace",
      "id": "cjtrfvai0000d01pe9te7134v"
    },
    {
      "name": "cli_e2e",
      "id": "cjtrfwbnn000k01qhwfs0juth"
    }
  ],
  "refresh-token": "i58YLaSl-QteYbH2PsvJz-xB4gWjXQdWTW085vqsRvy1_",
  "id-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik1qazNPVEZGTmtGQlEwRTNNa0pGT0RNeE1qUTJSamMzUVRRM1JqRTFSalF3UkRNME5qVkVSQSJ9.eyJodHRwczovLzhiYXNlLmNvbS92aXNpdG9yX2lkIjoiODkzNzYwZmMtNjdiNS00MmQyLThkYmYtYjliMWNkODAyYjNiIiwiZ2l2ZW5fbmFtZSI6InAiLCJmYW1pbHlfbmFtZSI6ImciLCJuaWNrbmFtZSI6Iml2YW4ucGluY2h1aytjbGlfdGVzdHMiLCJuYW1lIjoicCBnIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzhhMmU2Y2ZjYzE1MmM5ZjRhNTRlMjZhOTk2ZThiMTc3P3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGaXYucG5nIiwidXBkYXRlZF9hdCI6IjIwMTktMDMtMjdUMTY6NDQ6MTMuMTg5WiIsImVtYWlsIjoiaXZhbi5waW5jaHVrK2NsaV90ZXN0c0A4YmFzZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hdXRoLjhiYXNlLmNvbS8iLCJzdWIiOiJhdXRoMHw1YzliYTc0Mzc2MGMzMjBjNDQ0NjMzMGYiLCJhdWQiOiJxR0haVnU1Q3hZNWtsaXZtMjhPUExqb3B2c1lwMGJhRCIsImlhdCI6MTU1MzcwNTc1NCwiZXhwIjoxNTUzNzQxNzU0LCJub25jZSI6Ijhwc3V1YlNnZVpZN1pYb0kzUzZ1Vkd3bFBFYnlpRVRkIn0.guohAqfpIdntR6kX1iqnw2FRp1EzORKHBtvpK9hYRjCcjUV24ExerfA6wilFvixT4VvqelKRH91YEtF9oegtFgSXFteztNTRHRERECsYC580Ken-eLy5HT8ySDEldYsYMsoUnBW-MsAmO-Jv4GcLaciL2liCuTtibPNfQhfLV5t1ZSEO6Y8Ezh0QvVccwg4QptjGSWuX-NmVrmS8k0WNV1a7ceRwdRzPwA-F1Ma_jYnRbfDyhB2DGhC5B3Pbg1lzzJy4VVCS5Ky-jny7fjAvfYlPq7Ca8bheYkHFmdlSfgMvtlKyoDcbWMI84sQIJKFGs7VJEbANyBzAubich1LJWA",
  "active-workspace": "cjtrfwbnn000k01qhwfs0juth"
}
`;

export const createLoginedConfig = () => {
  fs.writeFileSync(path.join(process.env.HOME,".8baserc"), eightBaseRc, "utf8");
};

export const removeConfig = () => {
  fs.removeSync("~/.8baserc");
};
