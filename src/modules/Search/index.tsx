import React, { PureComponent } from 'react';
import Loading from '@/common/Loading';
import Error404 from '../Error404';

interface IndexProps {
  computedMatch: any;
  searchKeyword: (data: any, callback?: any) => any;
}

interface IndexState {
  showLoading: boolean,
}

class Search extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    computedMatch: {},
    searchKeyword: () => {
    },
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      showLoading: true,
    };
  }

  componentDidMount() {
    let keyword = this.props.computedMatch.params.keyword;
    if (keyword.indexOf(',') > 0) {
      keyword = keyword.replaceAll(',', '');
    }
    this.props.searchKeyword(keyword, () => this.showNotFound());
  }

  showNotFound() {
    this.setState({ showLoading: false });
  }

  render() {
    if (this.state.showLoading) {
      return <Loading />;
    }

    return <Error404 />;
  }
}

export default Search;
