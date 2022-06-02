import React, { useMemo, useState } from 'react';
import { getAddressCode } from '@/utils/sdk';
import { styled } from '@mui/material/styles';
import CodeContent from '@/Address/components/CodeContent';
import Loading from '@/common/Loading';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

type Props = {
  address:string
}
export default function CodeTable(props:Props){

  const [codes,setCodes] = useState<any>([])
  const [loading,setLoading] = useState(true)

  useMemo(async ()=>{
    const featch  =  async  ()=>{
      const  rs = await getAddressCode(props.address)
      setCodes(rs)
      console.info(rs)
      setLoading(false)
    }
    await featch()
  },[props.address])



  return <Root>
    {loading ?  <Loading />: <CodeContent codes={codes} />}
  </Root>
}