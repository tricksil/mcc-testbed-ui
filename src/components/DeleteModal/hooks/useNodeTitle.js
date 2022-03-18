import { useMemo } from 'react';

export default function (data) {
  const title = useMemo(() => {
    if (Object.keys(data).length === 0) {
      return 'delete nodes and edges';
    }
    const node = data?.dataNode?.nodes && 'node';
    const end =
      data?.dataNode?.nodes && data?.dataNode?.edges?.length > 0 ? 'end' : '';
    let edges = '';
    if (data?.dataNode?.edges?.length === 1) edges = 'edge';
    else if (data?.dataNode?.edges?.length > 1) edges = 'edges';

    return `${data.action} ${node} ${end} ${edges}`;
  }, [data]);
  return title;
}
