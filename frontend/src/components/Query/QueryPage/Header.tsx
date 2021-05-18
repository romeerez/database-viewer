import React from 'react';
import Header from 'components/Common/Header';

export default function QueryPageHeader() {
  const [name, setName] = React.useState('Query 1');

  return (
    <Header
      breadcrumbs={[
        'Queries',
        <input
          key={0}
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="title"
          className="ml-1 px-2 py-1 bg-dark-4 rounded"
        />,
      ]}
      controls={
        <>
          <button className="mr-2 py-1 px-4 duration-300 transition hover:text-light-4">
            Cancel
          </button>
          <button className="bg-darker-5 rounded py-1 px-4 duration-300 transition hover:text-light-4">
            Save
          </button>
        </>
      }
    />
  );
}
