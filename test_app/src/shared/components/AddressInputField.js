import React from 'react';
import { Column, Grid, InputField, Label } from '@8base/boost';
import { Field } from '@8base/forms';

export const AddressInputField = ({ label, input: { name } }) => (
  <Column gap="none" alignItems="stretch">
    {label && <Label kind="secondary">{label}</Label>}
    <Grid.Layout
      columns="100px 1fr 1fr"
      autoRows="auto"
      gap="sm"
      areas={[
        ['country', 'country', 'country'],
        ['street1', 'street1', 'street1'],
        ['street2', 'street2', 'street2'],
        ['zip', 'city', 'state'],
      ]}
    >
      <Grid.Box area="country">
        <Field name={`${name}.country`} component={InputField} placeholder="Country" />
      </Grid.Box>
      <Grid.Box area="street1">
        <Field name={`${name}.street1`} component={InputField} placeholder="Address Line 1" />
      </Grid.Box>
      <Grid.Box area="street2">
        <Field name={`${name}.street2`} component={InputField} placeholder="Address Line 2" />
      </Grid.Box>
      <Grid.Box area="zip">
        <Field name={`${name}.zip`} component={InputField} placeholder="Postal/Zip" />
      </Grid.Box>
      <Grid.Box area="city">
        <Field name={`${name}.city`} component={InputField} placeholder="City" />
      </Grid.Box>
      <Grid.Box area="state">
        <Field name={`${name}.state`} component={InputField} placeholder="State" />
      </Grid.Box>
    </Grid.Layout>
  </Column>
);
