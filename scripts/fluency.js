var MovieSearch = React.createClass({
  handleStoryChange: function(e)
  {
    this.setState({story: e.target.value})
    this.props.onPatternChange(e.target.value)
  },
  getInitialState: function()
  {
    return {
      story: ''
    }
      
  },
  render: function()
  {
    return (
        <div className="input-group">
          <span className="input-group-addon " id="basic-addon1">movie</span>
          <input type="text" 
            className="form-control" 
            aria-describedby="basic-addon1"
            value={this.state.story}
            onChange={this.handleStoryChange}
            />
        </div>
      );

  }

});


var ListItemSelectable = React.createClass({
  handleClick: function(a)
  {
    this.props.onItemClick(a, this.props.id)
  },
  render: function()
  {
    return (
        <li className="list-group-item" 
          onClick={this.handleClick}>
          {this.props.title}
        </li>
      );
  }
});

var MovieList = React.createClass({
  handleClick: function(e, movie_id)
  {
    if(this.state.active)
    {
      this.state.active.className='list-group-item';
    }
    this.setState({active: e.target});
    e.target.className+=" active";
    this.props.onMovieSelected(movie_id);
  },
  getInitialState: function()
  {
    return {
      active: null
    }
  },
  render: function(){
    var stories = this.props.stories.map(
        function(story, i)
        {
          return (
            <ListItemSelectable
              key={story.id}
              id={story.id}
              title = {story.title}
              onItemClick={this.handleClick}
              />
          );
        },
        this
      );
    return(
      <div>
        <ul className="list-group entity-list" 
          //onClick={this.handleClick.bind(null, -1)}
          >
          {stories}
        </ul>
      </div>
      );
  }
});

var MoviePages = React.createClass({
  render: function()
  {
    return (
      <nav>
        <ul className="pager pager-sm">
          <li className="previous disabled"><a href="#">Previous</a></li>
          <li className="next disabled"><a href="#">Next</a></li>
        </ul>
      </nav>
      );
  }
});

var MovieBox = React.createClass({
  handleMovieSelected: function(movie_id)
  {
    this.props.onMovieSelected(movie_id);
  },
  loadStories: function(pattern, page) {
    $.ajax({
      url: this.state.url,
      dataType: 'json',
      data: {pattern: pattern, page: page},
      cache: false,
      success: function(data)
      {
        this.setState({stories: data});
      }.bind(this)
    });
  },
  getInitialState: function()
  {
    return {
      url: '/front/stories',
      stories: [],
      pattern: '',
      page: 0
    };
  },
  componentDidMount: function() 
  {
    this.loadStories();
  },
  handlePatternChange: function(new_patern)
  {
    this.setState({pattern: new_patern, page: 0});
    this.loadStories(new_patern);
  },
  render: function()
  {
    return(
        <div className="col-md-6">
          <MovieSearch 
            story={this.state.pattern}
            onPatternChange={this.handlePatternChange}
            />
          <MovieList stories={this.state.stories}
            onMovieSelected={this.handleMovieSelected}
          />
        </div>
      );
  }

});
//--------------------------------
var SentenceSearch = React.createClass({
  handlePatternChange: function(e)
  {
    this.setState({pattern: e.target.value});
    this.props.onPatternChange(e.target.value);
  },
  getInitialState: function()
  {
    return {
      pattern: ''
    }
  },
  render: function()
  {
    return(
      <div className="input-group">
        <span className="input-group-addon" id="basic-addon2">words</span>
        <input type="text" 
          className="form-control" 
          aria-describedby="basic-addon2"
          value={this.state.pattern}
          onChange={this.handlePatternChange}
          />

      </div>
      );
  }

});

var SentenceList = React.createClass({
  handleClick: function(e, snippet_id)
  {
    if(this.state.active)
    {
      this.state.active.className='list-group-item';
    }
    this.setState({active: e.target});
    e.target.className+=" active";
  },
  getInitialState: function()
  {
    return (
    {active: null}
      );
    
  },
  render: function()
  {
    var snippets = this.props.snippets.map(
      function(snippet, i)
      {
        return(
          <ListItemSelectable
            key={snippet.id}
            id={snippet.id}
            title={snippet.text}
            onItemClick={this.handleClick} />
        );
      },
      this
      );
    return (
      <div>
        <ul className="list-group entity-list">
          {snippets}
        </ul>
      </div>
      );
  }

});

var SentencePages = React.createClass({
  
  render: function()
  {
    return(
      <nav>
        <ul className="pagination">
          <li>
            <a href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li><a href="#">1</a></li>
          <li><a href="#">2</a></li>
          <li><a href="#">3</a></li>
          <li><a href="#">4</a></li>
          <li><a href="#">5</a></li>
          <li>
            <a href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
      );
  }
})

var SentenceBox = React.createClass({
  loadSnippets: function(params)
  {
    if(!params.words && !params.story_id)
    {
      return;
    }
    $.ajax({
      url: '/front/snippets',
      dataType: 'json',
      data: params,
      cache: false,
      success: function(data)
      {
        this.setState({snippets: data, shown: params});
      }.bind(this),
      error: function(xhr, status, err)
      {
        console.log(xhr, status, err);
      }.bind(this)
    });
  },
  handlePatternChange: function(new_pattern)
  {
    this.props.onPatternChange(new_pattern);
    this.setState({pattern: new_pattern, page:0, pages:0});
    this.loadSnippets(new_pattern, 0);

  },
  getInitialState: function()
  {
    return {
      movie_id: this.props.movie_id,
      url: '/front/snippets',
      snippets: [],
      pattern: '',
      page: 0,
      pages: 0,
      shown: {pattern: '', page: 0}
    }
  },
  getRequeiredState: function()
  {
    if(this.props.movie_id)
    {
      return {story_id: this.props.movie_id, page: 0}
    }
    else
    {
      return {words: this.state.pattern, page: 0}
    }
  },
  isReqiredUpdate: function()
  {
    var required = this.getRequeiredState();
    if(required.words != this.state.shown.words 
      || required.story_id != this.state.shown.story_id)
    {
      return true;
    }
    return false;
  },
  render: function()
  {
    if(this.isReqiredUpdate())
    {
      this.loadSnippets(this.getRequeiredState());
    }
    return (
      <div className="col-md-6">
        <SentenceSearch 
          pattern={this.state.pattern}
          onPatternChange={this.handlePatternChange}
        />
        <SentenceList 
          snippets={this.state.snippets}
        />  
      </div>
      );
  }

});

var PlateBox = React.createClass({
  handleMovieSelected: function(movie_id)
  {
    this.setState({movie_id: movie_id});
    this.props.player.setSource('/123')
  },
  handleSentenceFilterChanged: function(new_patern)
  {
    this.setState({pattern: new_patern, movie_id: null});
  },
  getInitialState: function()
  {
    return {
      movie_id: null,
      pattern: ''
    }

  },
  render: function() {
    return (
      <div>
        <div className="row">
          <MovieBox 
            onMovieSelected={this.handleMovieSelected}
          />
          <SentenceBox 
            movie_id={this.state.movie_id}
            pattern={this.state.pattern}
            onPatternChange={this.handleSentenceFilterChanged}
          />
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <MoviePages />
          </div>
          <div className="col-md-6">
            <SentencePages />
          </div>
        </div>
      </div>
      );
  }
});
ReactDOM.render(
  <PlateBox 
    player = {document.getElementById('a-player')}
  />,
  document.getElementById('content')
);




// <div style="text-align:center">
//   <button onclick="playPause()">Play/Pause</button>
//   <button onclick="makeBig()">Big</button>
//   <button onclick="makeSmall()">Small</button>
//   <button onclick="makeNormal()">Normal</button>
//  <button onclick="setPos35()">setPos35</button>
// <button onclick="setPos34()">setPos34</button>
//   <br><br>
//   <video id="video1" width="420" controls>
//     <source src="mov_bbb.mp4" type="video/mp4" />
//     <source src="mov_bbb.ogg" type="video/ogg" />
//     Your browser does not support HTML5 video.
//   </video>
// </div>

// <script>
// var myVideo = document.getElementById("video1");
// myVideo.addEventListener('timeupdate', function() {
//   console.log(1, myVideo.currentTime);
// }, false);
// function playPause() {
//     if (myVideo.paused)
//         myVideo.play();
//     else
//         myVideo.pause();
// }

// function makeBig() {
//     myVideo.width = 560;
// }

// function makeSmall() {
//     myVideo.width = 320;
// }

// function makeNormal() {
//     myVideo.width = 420;
// }

// function setPos35()
// {
//   myVideo.currentTime = 3.5;
// }
// function setPos34()
// {
//   myVideo.currentTime = 3.45;
// }

// </script>