import { Form } from '../../../lib/useForm';
import React from 'react';
import { DataSourceInLocalStore } from '../../../components/DataSource/types';
import { useSaveDataSource } from '../../../components/DataSource/dataSource.service';

const urlAffectiveFields = ['host', 'port', 'user', 'password', 'database'];

const setOptionsFromUrl = (form: Form) => {
  let url = form.getValues().url;

  const driver = url.match(/^(.+?):\/\//);
  if (!driver) return;
  form.setValue('driver', driver[1]);

  url = url.slice(driver[0].length);
  const user = url.match(/^(.+?):/);
  if (!user) return;
  form.setValue('user', decodeURIComponent(user[1]));

  url = url.slice(user[0].length);
  const password = url.match(/^(.*?)@/);
  if (!password) return;
  form.setValue('password', decodeURIComponent(password[1]));

  url = url.slice(password[0].length);
  const host = url.match(/^(.+?):/);
  if (!host) return;
  form.setValue('host', decodeURIComponent(host[1]));

  url = url.slice(host[0].length);
  const port = url.match(/^(.+?)(\/|$)/);
  if (!port) return;
  form.setValue('port', parseInt(decodeURIComponent(port[1])));

  const database = url.slice(port[0].length);
  form.setValue('database', decodeURIComponent(database));
};

export const useConnectURLAndOtherFields = (form: Form) => {
  React.useEffect(() => {
    setOptionsFromUrl(form);
  }, []);

  const onFormChange = (e: { target: EventTarget }) => {
    const el = e.target as HTMLInputElement;
    const name = el.name;
    if (name === 'url') {
      setOptionsFromUrl(form);
    } else if (urlAffectiveFields.includes(name)) {
      const { driver, host, port, user, password, database } = form.getValues();

      let url = `${driver}://${user}:${password}@${host}:${port}`;
      if (database) url += `/${database}`;

      form.setValue('url', url);
    }
  };

  return { onFormChange };
};

export const useSubmit = ({
  form,
  dataSource,
  onClose,
}: {
  form: Form<{ name: string; url: string }>;
  dataSource?: DataSourceInLocalStore;
  onClose(): void;
}) => {
  const { save, loading } = useSaveDataSource({ dataSource, onClose });
  const submit = async () => {
    const values = form.getValues();
    const errors = await save(values);
    errors?.forEach((error) =>
      form.setError(error.field, { message: error.message }),
    );
  };
  return { submit, loading };
};
