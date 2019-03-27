import React from 'react';
import { COUNTRY_CODE_OPTIONS } from '@8base/utils';
import { Column, Grid, Label, SelectField, InputField } from '@8base/boost';
import { Field } from '@8base/forms';

export const PhoneInputField = ({ label, input: { name } }) => (
  <Column gap="none" alignItems="stretch">
    {label && <Label kind="secondary">{label}</Label>}
    <Grid.Layout columns="120px 1fr" autoRows="auto" gap="lg">
      <Grid.Box>
        <Field name={`${name}.code`} component={SelectField} placeholder="Code" options={COUNTRY_CODE_OPTIONS} />
      </Grid.Box>
      <Grid.Box justifyContent="flex-end">
        <Field name={`${name}.number`} component={InputField} placeholder="Number" />
      </Grid.Box>
    </Grid.Layout>
  </Column>
);
