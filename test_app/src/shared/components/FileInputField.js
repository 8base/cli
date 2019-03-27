import React from 'react';
import { FileInput } from '@8base/file-input';
import { Button, Form, Row, Text } from '@8base/boost';

export const FileInputField = ({ input, meta, maxFiles, label, ...rest }) => (
  <Form.Field label={label} input={input} meta={meta}>
    <FileInput onChange={input.onChange} value={input.value} maxFiles={maxFiles} public={rest.public}>
      {({ pick, value }) => (
        <Row stretch alignItems="center">
          <Button type="button" onClick={() => pick()} stretch color="neutral">
            Choose Files
          </Button>
          <Text size="sm">
            {value ? (Array.isArray(value) ? `${value.length} files selected` : value.filename) : 'No files selected'}
          </Text>
        </Row>
      )}
    </FileInput>
  </Form.Field>
);
