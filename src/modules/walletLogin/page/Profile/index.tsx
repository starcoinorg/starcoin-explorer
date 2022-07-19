import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles } from '@mui/styles';
import { Input, InputLabel, Button, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
// import classNames from 'classnames';
import { createSelector } from 'reselect';
// import { formatBalance, shortenAddress } from '@/utils/helper';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '@/common/Loading';
import storeLogin from '@/walletLogin/store';
import useRouterBeforeEach from '../../../../router/beforeRouter';
import { UserInfo } from '@/walletLogin/type';

const useStyles = () => createStyles({
    from: {
        width: '800px',
        margin: '100px auto',
        // border: '1px solid #fff',
        borderRadius: '20px',
        padding: '50px',
        background: '#424242'
    },
    labelName: {
        width: '33%',
        textAlign: 'right',

    },
    formLabel: {
        color: '#fff',
        margin: '20px',
        width: '100%',
        display: 'flex',
    },
    labelItem: {
        width: '66%',
    },
    uploadBtn: {
        width: '100px',
        height: '100px',
        border: '1px solid #fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    footer: {
        textAlign: 'center'
    }
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
    const [disabledBtn, setDisabledBtn] = useState(true);
    const dispatch = useDispatch();
    const { t }: { t: any, i18n: any } = useTranslation();

    const [alert, setAlert] = useState<any>({
        open: false,
        severity: 'success',
        message: ''
    })
    const form = useRef<UserInfo>({});
    const { classes } = props;
    useRouterBeforeEach();
    const changeFrom = (type: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDisabledBtn(false)
        const formData: UserInfo = {};
        formData[type] = e.target.value;
        form.current = {
            ...form.current,
            ...formData
        }
    }
    const submit = () => {
        dispatch({
            type: types.UPDATE_USERINFO,
            payload: form.current,
            callback: (res: any) => {
                if (res.status === '200') {
                    setAlert({
                        ...alert,
                        open: true,
                        severity: 'success',
                        message: t("common.success")
                    })
                } else {
                    setAlert({
                        ...alert,
                        open: true,
                        severity: 'error',
                        message: t("common.fail")
                    })
                }
                setDisabledBtn(true);
            }
        });
    }

    const closeAlert = () => {
        setAlert({
            ...alert,
            open: false
        })
    }
    return <>
        {state.userInfo.wallet_addr ? <div className={classes.from}>
            <InputLabel className={classes.formLabel} error={false}>
                <div className={classes.labelName}>
                    {t('user.Username')}：
                </div>
                <div className={classes.labelItem}>
                    <Input sx={{ '.Mui-disabled': { textFillColor: '#fff' } }} disabled defaultValue={state.userInfo.wallet_addr} className={classes.labelItem} />
                </div>
            </InputLabel>

            <InputLabel className={classes.formLabel} error={false}>
                <div className={classes.labelName}>
                    {t('user.Email address')}：
                </div>
                <div className={classes.labelItem}>
                    <Input defaultValue={state.userInfo.e_mail} onChange={(e) => { changeFrom('email', e) }} placeholder="请输入e-amil" className={classes.labelItem} />
                </div>
            </InputLabel>
            <InputLabel className={classes.formLabel} error={false}>
                <div className={classes.labelName}>
                    {t('user.Public Profile Picture')}：
                </div>
                <div className={classes.labelItem}>
                    <Input defaultValue={state.userInfo.avatar} onChange={(e) => { changeFrom('avatar', e) }} placeholder="请输入url" className={classes.labelItem} />
                </div>
            </InputLabel>

            <InputLabel className={classes.formLabel} error={false}>
                <div className={classes.labelName}>
                    {t('user.Profile Website')}：
                </div>
                <div className={classes.labelItem}>
                    <Input defaultValue={state.userInfo.profile} onChange={(e) => { changeFrom('profile', e) }} className={classes.labelItem} />
                </div>
            </InputLabel>
            <div className={classes.footer}>
                <Button onClick={submit} disabled={disabledBtn}>
                    {t('user.save change')}
                </Button>
            </div>
        </div> : <Loading />}
        <Snackbar open={alert.open} autoHideDuration={6000} onClose={closeAlert}>
            <Alert variant="filled"  severity={alert.severity} sx={{ width: '100%' }}>
                {alert.message}
            </Alert>
        </Snackbar>
    </>
}

Wallet.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Wallet);
