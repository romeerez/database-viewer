import React from 'react';
import Header from 'components/Common/Header';
import { Form } from 'lib/useForm';
import InputGroup from 'components/Common/Form/InputGroup';
import Button from 'components/Common/Button/Button';
import history from 'lib/history';

export default function QueryPageHeader({
  loading,
  form,
  onSubmit,
}: {
  loading: boolean;
  form: Form<{ name: string } | undefined>;
  onSubmit(): void;
}) {
  const submit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={submit}>
      <Header
        breadcrumbs={[
          'Queries',
          <InputGroup
            key={0}
            form={form}
            name="name"
            groupClassName="ml-1 flex items-center"
            errorClassName="text-error text-sm ml-2"
          />,
        ]}
        controls={
          <>
            <button
              type="button"
              className="btn mr-2"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
            <Button type="submit" loading={loading} className="btn btn-primary">
              Save
            </Button>
          </>
        }
      />
    </form>
  );
}
