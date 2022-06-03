import React, { useMemo, useState } from 'react';
import { listResources } from '@/utils/sdk';
import { styled } from '@mui/material/styles';
import { formatResources } from '@/utils/helper';
import Loading from '@/common/Loading';
import ResourceView from '@/common/View/ResourceView';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

type Props = {
  address: string
}

export default function ResourcesTab(props: Props) {
  const [loading, setLoading] = useState(true);
  const [accountResources, setAccountResources] = useState<any>([]);
  useMemo(async () => {
    const fetch = async () => {
      const res = await listResources(props.address);
      setAccountResources(formatResources(res.resources));
      setLoading(false);
    };
    await fetch();
  }, [props.address]);
  return <Root>
    {loading ? <Loading /> : <ResourceView resources={accountResources} />}
  </Root>;
}