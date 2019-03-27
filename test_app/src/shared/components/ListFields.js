import React from 'react';
import { Column, Row, Text, Icon, Label } from '@8base/boost';
import { Field } from '@8base/forms';

export const ListFields = ({ fields, label, component, defaultValue = '', ...rest }) => (
  <React.Fragment>
    {fields.length > 0 && <Label>{label}</Label>}
    <Column gap="sm" alignItems="stretch">
      {fields.map((name, index) => (
        <Row gap="sm" alignItems="center">
          <Field {...rest} key={name} name={name} component={component} />
          <Icon color="GRAY1" name="Delete" cursor="pointer" onClick={() => fields.remove(index)} />
        </Row>
      ))}
      <Text color="GRAY1" cursor="pointer" onClick={() => fields.push(defaultValue)}>
        Add {label}
      </Text>
    </Column>
  </React.Fragment>
);
