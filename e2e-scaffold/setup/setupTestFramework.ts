import { configureToMatchImageSnapshot } from 'jest-image-snapshot';

let toMatchImageSnapshot = configureToMatchImageSnapshot({
  failureThreshold: 0.1,
  failureThresholdType: 'percent',
});

const { E2E_SCAFFOLD_DEBUG } = process.env;

if (E2E_SCAFFOLD_DEBUG === 'true') {
  toMatchImageSnapshot = (): any => ({ pass: true });
}

expect.extend({ toMatchImageSnapshot });

jasmine.DEFAULT_TIMEOUT_INTERVAL = 420000;
