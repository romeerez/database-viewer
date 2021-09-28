import React from 'react';
import * as yup from 'yup';
import { useForm } from '../../../lib/useForm';
import SelectGroup from '../../../components/Common/Form/SelectGroup';
import InputGroup from '../../../components/Common/Form/InputGroup';
import TextAreaGroup from '../../../components/Common/Form/TextAreaGroup';
import { useConnectURLAndOtherFields, useSubmit } from './serverForm.service';
import Button from '../../../components/Common/Button/Button';
import { ServerInLocalStore } from '../types';

const drivers = [
  { label: 'PostgreSQL', value: 'postgres' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'MongoDB', value: 'mongo' },
];

const defaultValues = {
  name: 'local',
  url: 'postgres://postgres:@localhost:5432',
};

const schema = yup.object({
  name: yup.string().label('display name').required(),
  driver: yup
    .string()
    .oneOf(
      drivers.map(({ value }) => value),
      'please select value from the list',
    )
    .required(),
  host: yup.string().required(),
  port: yup.number().typeError('please specify a number').required(),
  user: yup.string().required(),
  password: yup.string(),
  database: yup.string(),
  url: yup.string().required(),
});

export default function ServerForm({
  server,
  onClose,
}: {
  server?: ServerInLocalStore;
  onClose(): void;
}) {
  const form = useForm({
    schema,
    defaultValues: server || defaultValues,
  });

  const { onFormChange } = useConnectURLAndOtherFields(form);

  const { submit, loading } = useSubmit({ form, server, onClose });

  return (
    <form
      ref={form.formRef}
      onSubmit={form.handleSubmit(submit)}
      className="text-light-3 p-4"
      onChange={onFormChange}
    >
      <div className="flex items-center justify-center mb-6 text-lg relative">
        Add data source
      </div>
      <div className="grid gap-4">
        <InputGroup form={form} label="Display name" name="name" autoFocus />
        <SelectGroup
          form={form}
          name="driver"
          label="Driver"
          options={drivers}
        />
        <InputGroup form={form} label="Host" name="host" />
        <InputGroup form={form} label="Port" name="port" width="w-24" />
        <InputGroup form={form} label="User" name="user" />
        <InputGroup
          form={form}
          label="Password"
          name="password"
          type="password"
        />
        <InputGroup form={form} label="Database" name="database" />
        <TextAreaGroup form={form} label="URL" name="url" />
      </div>
      <div className="flex-center mt-6">
        <Button type="submit" loading={loading}>
          Connect
        </Button>
      </div>
    </form>
  );
}
