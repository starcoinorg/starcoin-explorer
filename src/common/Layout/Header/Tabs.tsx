import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { createStyles, withStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const useStyles = () => createStyles({
  root: {
    display: 'flex',
  },
  link: {
    textDecoration: 'none',
  },
});

interface TabType {
  className?: string,
  id: string,
  label: string,
  selected: boolean,
  onClick?: () => void,
  href?: string,
}

interface ExternalProps {
  tabs: Array<TabType>,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps {
}

class Tabs extends React.PureComponent<Props> {
  render() {
    const { tabs, className, classes } = this.props;
    return (
      <div className={classNames(className, classes.root)}>
        {tabs.map((tab: any) => (
          <Link key={tab.id} className={classes.link} to={tab.href}>
            <Button
              className={tab.className}
              color={tab.selected ? 'primary' : 'inherit'}
              onClick={tab.onClick}
            >
              <Typography variant='body1' color='inherit'>
                {tab.label}
              </Typography>
            </Button>
          </Link>
        ))}
      </div>
    );
  }
}

export default withStyles(useStyles)(Tabs);
