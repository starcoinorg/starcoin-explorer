import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles, useTheme } from '@mui/styles';
import { Input, InputLabel, Button, Snackbar, Alert, Theme, Card, TextareaAutosize, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useTranslation } from 'react-i18next';
// import classNames from 'classnames';
import { createSelector } from 'reselect';
// import { formatBalance, shortenAddress } from '@/utils/helper';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '@/common/Loading';
import storeLogin from '@/walletLogin/store';
import useRouterBeforeEach from '../../../../router/beforeRouter';
import { UserInfo } from '@/walletLogin/type';

const useStyles = (theme: Theme) => createStyles({
    from: {
        width: '800px',
        margin: '100px auto',
        padding: '50px',
        background: theme.palette.mode === 'dark' ? '#424242' : "rgb(237, 238, 242)",
    },
    labelName: {
        width: '33%',
        textAlign: 'right',

    },
    formLabel: {
        // color: '#fff',
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
    okBtn: {
        color: "#fff!important",
        marginRight: '20px'
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
    const theme = useTheme() as any;
    const state = useSelector(selector);
    const [disabledBtn, setDisabledBtn] = useState(true);
    const dispatch = useDispatch();
    const { t }: { t: any, i18n: any } = useTranslation();

    const [openDialog, setOpenDialog] = useState(false);

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

    const Delete = () => {
        setOpenDialog(true)
    }
    const submitDelete = () =>{
        dispatch({
            type: types.DELETE_USERINFO,
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
                setOpenDialog(false)
            }
        });
    }
    const handleClose = () => {
        setOpenDialog(false)
    }
    const closeAlert = () => {
        setAlert({
            ...alert,
            open: false
        })
    }
    return <>
        {state.userInfo.wallet_addr ? <Card className={classes.from}>
            <InputLabel className={classes.formLabel} error={false}>
                <div className={classes.labelName}>
                    {t('user.Username')}：
                </div>
                <div className={classes.labelItem}>
                    <Input sx={{ '.Mui-disabled': { textFillColor: theme.palette.mode === 'dark' ? '#fff' : "#000" } }} disabled defaultValue={state.userInfo.wallet_addr} className={classes.labelItem} />
                </div>
            </InputLabel>

            <InputLabel className={classes.formLabel} error={false}>
                <div className={classes.labelName}>
                    {t('user.Email address')}：
                </div>
                <div className={classes.labelItem}>
                    <Input defaultValue={state.userInfo.e_mail} onChange={(e) => { changeFrom('email', e) }} placeholder={t('user.Email address placeholder')} className={classes.labelItem} />
                </div>
            </InputLabel>
            <InputLabel className={classes.formLabel} error={false}>
                <div className={classes.labelName}>
                    {t('user.Public Profile Picture')}：
                </div>
                <div className={classes.labelItem}>
                    <Input defaultValue={state.userInfo.avatar} onChange={(e) => { changeFrom('avatar', e) }} placeholder={t('user.Picture placeholder')} className={classes.labelItem} />
                </div>
            </InputLabel>
            <InputLabel className={classes.formLabel} error={false}>
                <div className={classes.labelName}>
                    {t('user.twitter name')}：
                </div>
                <div className={classes.labelItem}>
                    <Input defaultValue={state.userInfo.twitter_name} onChange={(e) => { changeFrom('twitter', e) }} placeholder={t('user.twitter placeholder')} className={classes.labelItem} />
                </div>
            </InputLabel>
            <InputLabel className={classes.formLabel} error={false}>
                <div className={classes.labelName}>
                    {t('user.discord name')}：
                </div>
                <div className={classes.labelItem}>
                    <Input defaultValue={state.userInfo.discord_name} onChange={(e) => { changeFrom('discord', e) }} placeholder={t('user.discord placeholder')} className={classes.labelItem} />
                </div>
            </InputLabel>
            <InputLabel className={classes.formLabel} error={false}>
                <div className={classes.labelName}>
                    {t('user.telegram name')}：
                </div>
                <div className={classes.labelItem}>
                    <Input defaultValue={state.userInfo.telegram_name} onChange={(e) => { changeFrom('telegram', e) }} placeholder={t('user.telegram placeholder')} className={classes.labelItem} />
                </div>
            </InputLabel>
            <InputLabel className={classes.formLabel} error={false}>
                <div className={classes.labelName}>
                    {t('user.Profile')}：
                </div>
                <div className={classes.labelItem}>
                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={3}
                        defaultValue={state.userInfo.profile}
                        onChange={(e) => { changeFrom('profile', e) }}
                        className={classes.labelItem}
                    />
                </div>
            </InputLabel>
            <div className={classes.footer}>
                <Button onClick={submit} variant="contained" className={classes.okBtn} disabled={disabledBtn}>
                    {t('user.save change')}
                </Button>

                <Button onClick={Delete} variant="contained" color="error">
                    {t('user.Delete User')}
                </Button>
            </div>
            <Dialog
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.getContrastText(theme.palette.background.paper),
                    }
                }}
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('user.warning')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{
                        color:'#fff'
                    }}>
                        {t('user.warning tip')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={submitDelete} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </Card> : <Loading />}
        <Snackbar open={alert.open} autoHideDuration={6000} onClose={closeAlert}>
            <Alert variant="filled" severity={alert.severity} sx={{ width: '100%' }}>
                {alert.message}
            </Alert>
        </Snackbar>
    </>
}

Wallet.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Wallet);
