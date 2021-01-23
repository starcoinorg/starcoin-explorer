import React from 'react';
import Card from '@material-ui/core/Card';
import CenteredView from '@/common/View/CenteredView';
import PageViewHeader from '@/common/View/PageViewHeader';
import PageViewTable from '@/common/View/PageViewTable';

interface ExternalProps {
  id: string,
  title: string,
  name: string,
  pluralName?: string,
  searchRoute?: string,
  headerIcon?: string,
  headerBackgroundColorClassName?: string,
  bodyColumns: any,
  extraCard?: any,
  extra?: any,
  children?: any,
  className?: string,
}

interface InternalProps {}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { id, title, name, pluralName, searchRoute, headerIcon, headerBackgroundColorClassName, bodyColumns, extraCard, extra, className } = this.props;
    return (
      <CenteredView className={className}>
        <Card>
          <PageViewHeader
            id={id}
            title={title}
            name={name}
            pluralName={pluralName}
            searchRoute={searchRoute}
            icon={headerIcon}
            backgroundColorClassName={headerBackgroundColorClassName}
          />
          <PageViewTable columns={bodyColumns} />
          {extraCard}
        </Card>
        {extra}
      </CenteredView>
    );
  }
}

export default Index;
