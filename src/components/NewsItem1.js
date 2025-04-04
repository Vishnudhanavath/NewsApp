import React, { Component } from 'react'

export class NewsItem extends Component {

  render() {
    let { description, title, imageUrl, newsUrl, author, time, source } = this.props;
    return (
      <>

        <div className='my-3'>
          <div className="card" >
            <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", top:"0",  right: "0" }}>

              <span class="  badge rounded-pill bg-danger" >
                {source}

              </span>
            </div>
            <img src={!imageUrl ? "https://media.cnn.com/api/v1/images/stellar/prod/231231063130-01-kharkiv-ukraine-attack-1231.jpg?c=16x9&q=w_800,c_fill" : imageUrl} className="card-img-top" alt="..." />
            <div className="card-body">

              <h5 className="card-title">{title}


              </h5>



              <p className="card-text">{description}</p>
              <p className="card-text"><small class="text-muted">By {!author ? "Unknown" : author} on {new Date(time).toGMTString()}</small></p>
              <a rel="noreferrer" href={newsUrl} target="_blank" className="btn btn-dark">Read More</a>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default NewsItem
