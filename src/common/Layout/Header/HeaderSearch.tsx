import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { IconButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Input from '@mui/material/Input/Input';
import { useTheme } from '@mui/styles';

type Props = {
  up: boolean
}

export default function HeaderSearch(props: Props) {
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const { t }: { t: any } = useTranslation();
  const theme: any = useTheme();
  const handleClickSearch = () => {
    navigate(`/search/${input.trim()}`);
  };


  return (

    <FormControl sx={props.up ? {
      [theme.breakpoints.up('md')]: {
        width:theme.spacing(36)
      },
      [theme.breakpoints.up('lg')]: {
        width:theme.spacing(36)
      },

      [theme.breakpoints.up('xl')]: {
        width:theme.spacing(64)
      },

    } : { width: '90%' }}  variant='outlined'>
      <InputLabel htmlFor='outlined-adornment-password'>{t('home.searchHint')}  </InputLabel>
      <Input
        onKeyUp={(event) => {
          if (event.key === 'Enter') {
            handleClickSearch();
          }
        }}
        sx={
          {
            display: 'flex',
            flex: '1 1 auto',
            marginRight: theme.spacing(1),
            '& .MuiInputBase-input': {
              color: theme.palette.getContrastText(theme.palette.background.paper),
              borderColor: 'red',

            },
            '& .MuiInputLabel-root': {
              color: theme.palette.mode === 'dark' ? theme.palette.grey[500] : undefined,
            },
          }
        }
        id='outlined-adornment-password'
        type='text'
        value={input}
        onChange={(v) => {
          setInput(v.target.value);
        }}
        endAdornment={
          <InputAdornment position='end' onClick={handleClickSearch}>
            <IconButton
              edge='end'
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}