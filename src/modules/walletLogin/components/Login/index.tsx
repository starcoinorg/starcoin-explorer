import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { createStyles, useTheme, withStyles } from '@mui/styles';
import classNames from 'classnames';
import { createSelector } from 'reselect';
import { formatBalance, shortenAddress } from '@/utils/helper';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Menu, MenuItem } from '@mui/material';

import { useNavigate } from 'react-router-dom'
import storeLogin from '@/walletLogin/store';

const useStyles = (theme: any) => createStyles({
    connectWallet: {
        textAlign: 'center',
        outline: 'none',
        textDecoration: 'none',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        willChange: 'transform',
        transition: 'transform 450ms ease 0s',
        transform: 'perspective(1px) translateZ(0px)',
        fontSize: '16px',
        display: 'flex',
        flexFlow: 'row nowrap',
        width: '100%',
        alignItems: 'center',
        padding: '0.5rem',
        borderRadius: '12px',
        cursor: 'pointer',
        userSelect: 'none',
        fontWeight: '500',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(21, 61, 111, 0.44)' : "rgb(250, 249, 254)",
        border: theme.palette.mode === 'dark' ? '1px solid rgba(21, 61, 111, 0.44)' : 'none',
        color: 'rgb(67, 139, 240)',
        marginRight: '20px'
    },
    accounts: {
        textAlign: 'center',
        textDecoration: 'none',
        justifyContent: 'center',
        position: 'relative',
        zIndex: '1',
        willChange: 'transform',
        transition: 'transform 450ms ease 0s',
        transform: ' perspective(1px) translateZ(0px)',
        fontSize: '16px',
        display: 'flex',
        flexFlow: 'row nowrap',
        width: '100%',
        alignItems: 'center',
        padding: '0.5rem',
        borderRadius: '12px',
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgb(33, 36, 41)' : "rgb(250, 249, 254)",
        border: theme.palette.mode === 'dark' ? '1px solid rgb(44, 47, 54)' : 'none',
        color: theme.palette.mode === 'dark' ? 'rgb(255, 255, 255)' : '#000',
        fontWeight: '500',
        marginRight: '3px'
    },
    balances: {
        boxSizing: 'border-box',
        margin: '0px',
        paddingLeft: '0.75rem',
        paddingRight: '0.5rem',
        fontWeight: '500',
    },
    walletInfo: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgb(44, 47, 54)' : "rgb(237, 238, 242)",
        borderRadius: '12px',
        whiteSpace: 'nowrap',
        width: '100%',
        cursor: 'pointer',
        marginRight: '20px'
    },

});
const { selector: currentSelector, types } = storeLogin;


const selector = createSelector(
    currentSelector,
    (current) => ({
        ...current,
    }),
);
function Wallet(props: any) {
    const state = useSelector(selector);
    const history = useNavigate();
    const dispatch = useDispatch();
    const { t }: { t: any, i18n: any } = useTranslation();
    const { classes } = props;
    useEffect(() => {
        dispatch({
            type: types.WALLETINIT,

        })
    }, [dispatch])
    const connectWallet = () => {
        dispatch({
            type: types.CONNECTWALLET,
            payload: true
        })
    }
    const logOut = () => {
        dispatch({
            type: types.LOGOUT,
            callback: () => {
                history(`/`);
                setAnchorEl(null);
            }
        })
    }

    const goProfile = () => {
        history(`/user/Profile`)
        setAnchorEl(null);
    }
    const goApiKeys = () => {
        history(`/user/ApiKeys`);
        setAnchorEl(null);
    }
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme() as any;
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return <>
        {state?.connectState ?
            <div className={classNames(classes.walletInfo)}>
                <div className={classNames(classes.balances)}>{formatBalance(state?.balances || '0', 4)} STC</div>
                <Button
                    className={classNames(classes.accounts)}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    {shortenAddress(state?.accounts[0])}
                </Button>
                <Menu
                    sx={{
                        "& .MuiPopover-paper": {
                            backgroundColor: theme.palette.background.default,
                            color: theme.palette.getContrastText(theme.palette.background.paper),
                        }
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={goProfile}>{t('user.My Profile')}</MenuItem>
                    <MenuItem onClick={goApiKeys}>{t('user.API Keys')}</MenuItem>
                    <MenuItem onClick={logOut}>{t('user.Logout')}</MenuItem>
                </Menu>
            </div>
            :
            <div className={classNames(classes.connectWallet)} onClick={connectWallet}>
                {t('user.login')}
            </div>
        }

    </>
}

Wallet.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Wallet);
