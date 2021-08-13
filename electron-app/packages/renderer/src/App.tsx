import React, { useEffect } from 'react';
import { APIContext as APIContextType } from 'types';

export default function App({
  apiContext: {
    useCheckConnectionMutation,
    useGetDataTreeLazyQuery,
    useQueryFieldsAndRowsLazyQuery,
    useQueryRowsLazyQuery,
  },
}: {
  apiContext: APIContextType;
}) {
  const url = 'postgres://postgres:@localhost:5432';

  const [checkConnection] = useCheckConnectionMutation();

  const [loadDataTree] = useGetDataTreeLazyQuery({
    onCompleted(data) {
      console.log('tree', data);
    },
  });

  const [queryFieldsAndRows] = useQueryFieldsAndRowsLazyQuery({
    onCompleted(data) {
      console.log('fields and rows', data);
    },
  });

  const [queryRows] = useQueryRowsLazyQuery({
    onCompleted(data) {
      console.log('rows', data);
    },
  });

  useEffect(() => {
    checkConnection({ variables: { url } }).then((result) => {
      console.log('checkConnection', result);
    });
  }, [checkConnection, url]);

  useEffect(() => {
    loadDataTree({ variables: { urls: [url] } });
  }, [loadDataTree, url]);

  useEffect(() => {
    queryFieldsAndRows({
      variables: { url: url, query: 'SELECT 1 as one, 2 as two' },
    });
  }, [queryFieldsAndRows, url]);

  useEffect(() => {
    queryRows({ variables: { url: url, query: 'SELECT 1 as one, 2 as two' } });
  }, [queryRows, url]);

  return <div>hello world</div>;
}
