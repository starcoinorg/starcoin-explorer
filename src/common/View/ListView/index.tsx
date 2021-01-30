import React from 'react';
import Card from '@material-ui/core/Card';
import CenteredView from '@/common/View/CenteredView';
import CommonHeader from '@/common/View/CommonHeader';

interface ExternalProps {
  title: string,
  name: string,
  pluralName: string,
  content: any,
  className?: string,
}

class Index extends React.PureComponent<ExternalProps> {
  render() {
    const { title, name, pluralName, content, className } = this.props;
    return (
      <CenteredView className={className}>
        <Card>
          <CommonHeader title={title} name={name} pluralName={pluralName} />
          {content}
        </Card>
      </CenteredView>
    );
  }
}

export default Index;
