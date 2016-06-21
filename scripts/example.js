 // tutorial2.js
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(
    function(comment, i){
      return (
        <Comment author={'aa'+i} key={comment.id}>
          {comment.title}
        </Comment>
        );
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});



var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }
});

var CommentBox = React.createClass({
  loadStories: function() {
    $.ajax({
      url: this.state.url,
      dataType: 'json',
      cache: false,
      success: function(data)
      {
        this.setState({stories: data});
      }.bind(this)
    });
  },
  getInitialState: function()
  {
    return {data: [],
      url: '/front/stories',
      stories: []
    };
  },
  componentDidMount: function() 
  {
    this.loadStories();
  },
  render: function() {
    return (
      <div className="starter-template jumbotron">
        title page
        <CommentList data={this.state.stories}/>
        <CommentForm />
      </div>
    );
  }
});


var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});



// var CommentBox = React.createClass({
//   render: function() {
//     return (
//       <div className="commentBox">
//         lession page.
//       </div>
//     );
//   }
// });
// ReactDOM.render(
//   <CommentBox />,
//   document.getElementById('content2')
// );

ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);