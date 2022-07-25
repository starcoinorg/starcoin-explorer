import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles, useTheme } from '@mui/styles';
import { Alert, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Input, InputLabel, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


import { useTranslation } from 'react-i18next';
// import classNames from 'classnames';
import { createSelector } from 'reselect';
// import { formatBalance, shortenAddress } from '@/utils/helper';
import { getFormatDate } from '@/utils/dayjs';
import useRouterBeforeEach from 'router/beforeRouter';
import { useSelector } from 'react-redux';
import storeLogin from '@/walletLogin/store';
import { addApiKey, apiKeyList, removeApiKey, updateApiKey } from '@/walletLogin/store/apis';
import { APIKeysItem } from '@/walletLogin/type';


const useStyles = (theme:Theme) => createStyles({
    title: {
        color: theme.palette.mode === 'dark' ?"#fff" : "#000",
        fontWeight: 'bold'
    },
    addBtn: {
        color: theme.palette.mode === 'dark' ?"#fff" : "#000",
        background: theme.palette.mode === 'dark' ? "rgb(33, 36, 41)" : "#fff",
        marginLeft: '10px',
        '&:hover': {
            background:  theme.palette.mode === 'dark' ?"rgb(33, 36, 41)" : "#fff",
        },
    },
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
        width: '100%',
        display: 'flex',
        margin: '20px 0'
    },
    labelItem: {
        width: '66%'
    }
});
const { selector: currentSelector } = storeLogin;


const selector = createSelector(
    currentSelector,
    (current) => ({
        ...current,
    }),
);

function Wallet(props: any) {
    const state = useSelector(selector);
    // const dispatch = useDispatch();
    const { t }: { t: any, i18n: any } = useTranslation();
    const { classes } = props;
    const [list, setlist] = useState<APIKeysItem[]>([])
    const [fromCreate, setFromCreate] = useState<string>('');
    const [editItem, setEditItem] = useState<APIKeysItem>({});
    useRouterBeforeEach();
    const [alert, setAlert] = useState<any>({
        open: false,
        severity: 'success',
        message: ''
    })
    const theme = useTheme() as any
    const styles = {
        padding: theme.spacing(1),
        color: theme.palette.getContrastText(theme.palette.background.paper),
        borderBottom: theme.palette.mode === 'dark' ? '1px solid rgba(256, 256, 256, 0.075)' : '1px solid rgba(0, 0, 0, 0.075)'
    }
    const init = () => {
        apiKeyList({ address: state.accounts[0] }).then((res: any) => {
            if (res.status === '200') {
                setlist(res.data)
            }
        }).catch((error: any) => {
            console.log(error)
        })
    }

    useEffect(() => {
        if (state.accounts[0]) {
            init()
        }
        // eslint-disable-next-line
    }, [state.accounts])

    const [openAdd, setOpenAdd] = React.useState(false);
    const handleClickOpenAdd = () => {
        setFromCreate('');
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
    };
    const create = async () => {
        const res = await addApiKey({
            address: state.accounts[0],
            app_name: fromCreate
        })
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
        init()
        setOpenAdd(false);
    }
    const edit = async () => {
        const res = await updateApiKey({
            // address: state.accounts[0],
            app_name: editItem.app_name,
            app_key: editItem.api_key
        })
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
        init()
        setOpenEdit(false);
    }
    const changeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditItem({
            ...editItem,
            app_name: e.target.value
        })
    }
    const [openEdit, setOpenEdit] = React.useState(false);
    const handleClickOpenEdit = (item: APIKeysItem) => {
        setEditItem(item);
        setOpenEdit(true);
    };

    const itemDelete = async () => {
        const res = await removeApiKey({
            app_key: editItem.api_key
        })
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
        init()
        setOpenEdit(false);
    };
    const appNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFromCreate(e.target.value)
    }
    const handleCloseEdit = () => {
        setOpenEdit(false);
    }
    const closeAlert = () => {
        setAlert({
            ...alert,
            open: false
        })
    }
    return <>
        <Card className={classes.from}>
            <div className={classes.title}>
                <span>{t('APIkeys.My API Keys')}</span>
                <Button className={classes.addBtn} onClick={handleClickOpenAdd}>
                    <AddIcon />
                    {t('APIkeys.Add')}
                </Button>
            </div>
            <TableContainer>
                <Table sx={{ minWidth: 400 }} aria-label='simple table'>
                    <TableHead>
                        <TableRow >
                            <TableCell sx={styles} align='center'>{t('APIkeys.Action')}</TableCell>
                            <TableCell sx={styles} align='left'>{t('APIkeys.API-Key Token')}</TableCell>
                            <TableCell sx={styles} align='left'>{t('APIkeys.Created')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((item) => {
                            return <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                key={item.api_key}
                            >
                                <TableCell sx={styles} align='center' component='th' scope='row'>
                                    <Button onClick={() => { handleClickOpenEdit(item) }}>{t('APIkeys.Edit')}</Button>
                                </TableCell>

                                <TableCell sx={styles} align='left' >{item.api_key}</TableCell>
                                <TableCell sx={styles} align='left' > {getFormatDate(item.create_time, "YYYY-MM-DD HH:mm:ss")}</TableCell>
                            </TableRow>
                        })}

                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={alert.open} autoHideDuration={6000} onClose={closeAlert}>
                <Alert variant="filled" severity={alert.severity} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
            <Dialog
                open={openAdd}
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.getContrastText(theme.palette.background.paper),
                    }
                }}
                fullWidth={true as boolean}
                onClose={handleCloseAdd}
            >
                <DialogTitle>{t('APIkeys.Create a new API-KEY token')}</DialogTitle>
                <DialogContent>
                    <InputLabel className={classes.formLabel} error={false}>
                        <div className={classes.labelName}>
                            {t('APIkeys.AppName')}：
                        </div>
                        <div className={classes.labelItem}>
                            <Input onChange={appNameChange} />

                        </div>
                    </InputLabel>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAdd}>{t('APIkeys.Cancel')}</Button>
                    <Button onClick={create}>{t('APIkeys.Subscribe')}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.getContrastText(theme.palette.background.paper),
                    }
                }}
                fullWidth={true as boolean}
                open={openEdit}
                onClose={handleCloseEdit}
            >
                <DialogTitle>{t('APIkeys.Edit a new API-KEY token')}</DialogTitle>
                <DialogContent>
                    <InputLabel className={classes.formLabel} error={false}>
                        <div className={classes.labelName}>
                            {t('APIkeys.ApiKey')}：
                        </div>
                        <div className={classes.labelItem}>
                            {editItem.api_key}
                        </div>
                    </InputLabel>
                    <InputLabel className={classes.formLabel} error={false}>
                        <div className={classes.labelName}>
                            {t('APIkeys.AppName')}：
                        </div>
                        <div className={classes.labelItem}>
                            <Input value={editItem.app_name} onChange={changeEdit} />
                        </div>
                    </InputLabel>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={itemDelete}>{t('APIkeys.Delete')}</Button>
                    <Button onClick={edit}>{t('APIkeys.Subscribe')}</Button>
                </DialogActions>
            </Dialog>
        </Card>
    </>
}

Wallet.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Wallet);
