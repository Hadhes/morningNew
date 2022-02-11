import React, {useState, useEffect } from 'react';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'

import {connect} from 'react-redux'

const { Meta } = Card;

function ScreenMyArticles(props) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [wishlist, setWishList] = useState([])

  let articlesWishlist = []


  useEffect(() => {

    const findArticlesInWishlist = async() => {
      const wishlist = await fetch(`/wishlist-article?&token=${props.token}`);
      const wishlistResponse = await wishlist.json();
      console.log('wL Response', wishlistResponse);

      console.log('wL Response', wishlistResponse.articles);
      articlesWishlist = wishlistResponse.articles;
      console.log('articlesWishlist', articlesWishlist);
      setWishList(articlesWishlist)
    };
    findArticlesInWishlist();

  }, []);


  const showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)

  }

  const handleOk = e => {
    console.log(e)
    setVisible(false)
  }

  const handleCancel = e => {
    console.log(e)
    setVisible(false)
  }

  // var noArticles = '';
  // if (articlesWishlist.length === 0) {
  //   noArticles = <div style={{marginTop:"30px"}}>No Articles</div>
  // }

  console.log('articlesWishlist2', articlesWishlist)


  return (
    <div>
      <Nav/>
        <div className="Banner"/>
        {/* {noArticles} */}
        <div className="Card">
        {wishlist.map((article,i) => (
          <div key={i} style={{display:'flex',justifyContent:'center'}}>
            <Card
              style={{ 
                width: 300, 
                margin:'15px', 
                display:'flex',
                flexDirection: 'column',
                justifyContent:'space-between'
              }}
              cover={
                <img
                  alt="example"
                  src={article.urlToImage}
                />
              }
              actions={[
                <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title,article.content)} />,
                <Icon type="delete" key="ellipsis" onClick={() => props.deleteToWishList(article.title)} />
              ]}
            >
              <Meta
                title={article.title}
                description={article.description}
              />
            </Card>
            <Modal
              title={title}
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>{content}</p>
            </Modal>
          </div>
        ))}
    </div>
  </div>
  );
}

function mapStateToProps(state){
  return {
    myArticles: state.wishList,
    token: state.token
  }
}

function mapDispatchToProps(dispatch){
  return {
    deleteToWishList: function(articleTitle){
      dispatch({type: 'deleteArticle',
        title: articleTitle
      })
    },
    // saveArticle: function(articles) {
    //   dispatch({ type: 'saveArticle',
    //              articles: articles })
    // }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles);
