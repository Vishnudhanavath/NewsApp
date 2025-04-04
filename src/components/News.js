import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'; 

export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: "general"

  }
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  constructor(props) {
    super(props);
    console.log("this is a new constructor");


    this.state = {

      articles: [],
      loading: true,
      page: 1,
      totalResults:0
      // category:"politics"
    }
    document.title = `${this.Capitalize(this.props.category)}-NewsMonkey`;



    // console.log("this is a new constructor".5))
  }
  // https://newsapi.org/v2/top-headlines?country=in&apiKey=4532b3f5dec24ce2975337035a09c78f&PageSize=${this.props.pageSize}
  updateNews = async () => {
    this.props.setProgress(10)
    let url = (`https://newsapi.org/v2/top-headlines?category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&PageSize=${this.props.pageSize}`);
    // let url="https://newsdata.io/api/1/latest?apikey=pub_72511f5b5f7c111672884b2a91e46149b9ca2&country=in"
    this.setState({ loading: true })
    let data = await fetch(url);
    this.props.setProgress(50)
    let parsedData = await data.json();
    this.props.setProgress(75)
    this.setState({ loading: false })
    console.log("hello world")
    console.log(parsedData.articles);
    this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults });
    this.setState({ totalPages: Math.ceil(this.state.totalResults / this.props.pageSize) });
    this.props.setProgress(100)


  }
  async componentDidMount() {


    // this.setState({})
    this.updateNews();



  }
  handlePrevbutton = async () => {

    this.setState({ page: this.state.page - 1 })
    this.updateNews();

  }
  handleNextbutton = async () => {
    if (this.state.page + 1 > this.state.totalPages) {

    }
    else {

      this.setState({ page: this.state.page + 1 });
      this.updateNews();
    }

  }
  Capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);

  }
  fetchMoreData = async() => {
    setTimeout(async() => {
      this.setState({page:this.state.page+1});
      // country=${this.props.country}&
      let url = (`https://newsapi.org/v2/top-headlines?category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&PageSize=${this.props.pageSize}`);
      
      let data = await fetch(url);
      let parsedData = await data.json();
      
      console.log(parsedData.articles);
      this.setState({ articles: this.state.articles.concat(parsedData.articles)});
    }, 1500);

   

 
  
  };

  render() {
    return (
      <>

        <h2 className="text-center" style={{ margin: "40px 0px" }}>NewsMonkey - Top {this.Capitalize(this.props.category)} headLines </h2>


        {this.state.loading && <Spinner />}


        {/* <div className="container d-flex justify-content-around" >
          <button type="button" class="btn btn-primary" onClick={()=>{this.setState({category:"sports"});this.componentDidMount();}}>sports</button>
          <button type="button" class="btn btn-primary" onClick={()=>{this.setState({category:"science"});this.componentDidMount();}}>science</button>
          <button type="button" class="btn btn-primary" onClick={()=>{this.setState({category:"technology"});this.componentDidMount();}}>technology</button>
        </div>   */}
        {/* this is for pagination purpose */}
        {/* <div className="row">
          {!this.state.loading &&this.state.articles&&this.state.articles.length>0 && this.state.articles.map((element) => {

            return <div className="col-md-4" key={element.url}>

              {/* {console.log(element.description.slice(0,8))} */}
        {/* <NewsItem title={element.title.slice(0, 45)} description={element.description != null ? element.description.slice(0, 88) : element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} time={element.publishedAt} source={element.source.name}/> */}

        {/* </div> */}
        {/* })} } */}




        {/* </div> */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          // style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
          // inverse={true} //
          hasMore={this.state.articles.length!==this.state.totalResults}
          loader={<Spinner/>}
          scrollableTarget="scrollableDiv"
        >
        <div className="container">

       
          <div className="row">
            {this.state.articles && this.state.articles.length > 0 && this.state.articles.map((element) => {

              return <div className="col-md-4" key={element.url}>

                {/* {console.log(element.description.slice(0,8))} */}
                <NewsItem title={element.title.slice(0, 45)} description={element.description != null ? element.description.slice(0, 88) : element.description}  description2={element.description != null ? element.description : element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} time={element.publishedAt} source={element.source.name} />

              </div>
            })}
          </div>
          </div>
          </InfiniteScroll>
          {/* <div className="container d-flex justify-content-between" >
          <button disabled={this.state.page <= 1} type="button" class="btn btn-dark" onClick={this.handlePrevbutton}>&larr; previous</button>
          <button disabled={this.state.page>=this.state.totalPages} type="button" class="btn btn-dark" onClick={this.handleNextbutton}>Next &rarr;</button>
        </div> */}



      </>
    )
  }
}

export default News
