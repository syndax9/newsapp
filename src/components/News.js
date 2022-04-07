import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {

  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }

  capitalizedFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    }
    document.title = `${this.capitalizedFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=97ea130964b849a88ce3f90f19674306&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true })
    let data = await fetch(url);
    let parsedData = await data.json()
    this.setState({
      articles: parsedData.articles,
      totalArticles: parsedData.totalResults,
      loading: false
    })
  }

  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async() => {
    this.setState({ page: this.state.page + 1 })
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=97ea130964b849a88ce3f90f19674306&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json()
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalArticles: parsedData.totalResults,
    })
  };

  render() {
    return (
      <>
        <h1 className='text-center' style={{ margin: '35 px' }}>NewsMonkey - Top {this.props.category != 'general' ? this.capitalizedFirstLetter(this.props.category) : ''} Headlines</h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {!this.state.loading && this.state.articles.map((element) => {
                return <div className="col-md-4" key={element.url}>
                  <NewsItem title={element.title ? element.title.slice(0, 45) : " "} description={element.description ? element.description.slice(0, 80) : " "} imgUrl={element.urlToImage ? element.urlToImage : "https://c.ndtvimg.com/2022-04/0pbr5a78_kyiv-bucha-afp_625x300_03_April_22.jpg"} newsUrl={element.url} author={element.author ? element.author : 'Unknown'} date={element.publishedAt} source={element.source.name} />
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    )
  }
}

export default News
