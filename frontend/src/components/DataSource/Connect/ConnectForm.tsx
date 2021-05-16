import React, { useState } from 'react';
import { X } from 'icons';
import * as yup from 'yup';
import { useForm } from 'lib/useForm';
import SelectGroup from 'components/Common/Form/SelectGroup';
import InputGroup from 'components/Common/Form/InputGroup';
import TextAreaGroup from 'components/Common/Form/TextAreaGroup';
import { useConnectURLAndOtherFields } from 'components/DataSource/Connect/connectForm.service';
import { toast } from 'react-toastify';
import { useCheckConnectionMutation } from 'generated/graphql';
import Button from 'components/Common/Button/Button';
import { dataSourcesStore } from 'components/DataSource/dataSource.store';

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

export default function ConnectForm({
  values,
  onClose,
}: {
  values?: ReturnType<typeof schema.validateSync>;
  onClose(): void;
}) {
  const form = useForm({
    schema,
    defaultValues: values || defaultValues,
  });

  const { onFormChange } = useConnectURLAndOtherFields(form);

  const [checkConnection] = useCheckConnectionMutation();

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const { name, url } = form.getValues();
    const { data } = await checkConnection({ variables: { url } });
    if (data?.checkConnection) {
      await dataSourcesStore.create({ name, url, createdAt: new Date() });
      onClose();
      toast.info('Data source added!');
    } else {
      toast('Cannot connect', { type: 'error' });
      setLoading(false);
    }
  };

  return (
    <form
      ref={form.formRef}
      onSubmit={form.handleSubmit(submit)}
      className="text-light-3 p-4 w-96"
      onChange={onFormChange}
    >
      <div className="flex items-center justify-center mb-6 text-lg relative">
        Add new database connection
        <button
          type="button"
          className="flex absolute top-0 right-0"
          onClick={onClose}
        >
          <X size={24} />
        </button>
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
