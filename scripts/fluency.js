var MovieSearch = React.createClass({
  handleStoryChange: function(e)
  {
    this.setState({pattern: e.target.value});
    this.props.onPatternChange(e.target.value);
  },
  getInitialState: function()
  {
    return (
    {
      pattern: ''
    })
  },
  render: function()
  {
    return (
        <div className="input-group">
          <span className="input-group-addon" id="basic-addon1">movie</span>
          <input type="text" 
            className="form-control" 
            aria-describedby="basic-addon1"
            value={this.state.pattern}
            onChange={this.handleStoryChange}
            />
        </div>
      );

  }

});


var ListItemSelectable = React.createClass({
  handleClick: function(a)
  {
    this.props.onItemClick(this.props.id)
  },
  render: function()
  {
    var className='list-group-item';
    if(this.props.active)
    {
      className='list-group-item active';
    }
    return (
        <li className={className} 
          onClick={this.handleClick}>
          {this.props.title}
        </li>
      );
  }
});

var MovieList = React.createClass({
  handleClick: function(e, movie_id)
  {
    this.props.onMovieSelected(movie_id);
  },
  getInitialState: function()
  {
    return {
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
              active = {story.id==this.props.active_id}
              onItemClick={this.props.onMovieSelected}
              />
          );
        },
        this
      );
    return(
      <div>
        <ul className="list-group entity-list" 
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
  
  getInitialState: function()
  {
    return {
    };
  },
  render: function()
  {
    return(
        <div className="col-md-6">
          <MovieSearch 
            onPatternChange={this.props.onPatternChange}
            />
          <MovieList 
            stories={this.props.stories}
            pages={this.props.pages}
            page={this.props.page}
            active_id={this.props.active_id}
            onMovieSelected={this.props.onMovieSelected}
          />
        </div>
      );
  }

});
//--------------------------------


var SnippetList = React.createClass({
  
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
            active={snippet.id==this.props.active_id}
            onItemClick={this.props.onSnippetSelected} />
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

var PageSelectable = React.createClass({
  handlePageSelected: function()
  {
    if(this.props.active)
    {
      return;
    }
    this.props.onItemClick(this.props.id);
  },
  render: function()
  {
    var className
    if(this.props.active)
    {
      className="active";
    }
    else
    {
      className="";
    }
    return (
      <li 
          className={className}
          onClick={this.handlePageSelected}>
        <a href="#">{this.props.id+1}</a>
      </li>
      );
  }
});

var SnippetPages = React.createClass({
  render: function()
  {
    var pages = [];
    var _active = this.props.active;
    var left = 0;
    var right = this.props.pages;
    var i;
    if(left<0)
    {
      left=0;
    }
    if(right>this.props.pages)
    {
      right=this.props.pages;
    }
    if(_active<0)
    {
      _active=0;
    }
    if(_active>=this.props.pages)
    {
      _active=this.props.pages-1;
    }

    var numbers= [];
    for(i=left; i<right; i++)
    {
      numbers.push(i);
    }
    pages = numbers.map(
        function(a, i)
        {
          return(
            <PageSelectable
              key={a}
              id={a}
              onItemClick={this.props.onPageChanged}
              active={this.props.page==i}
            />
          );

        },
        this
      );

    return(
      <nav>
        <ul className="pagination">
          <li className="disabled">
            <a href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {pages}
          <li className="disabled">
            <a href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
      );
  }
});

var SnippetBox = React.createClass({
  
  render: function()
  {
   
    return (
      <div className="col-md-6">
        
        <SnippetList 
          snippets={this.props.snippets}
          active_id={this.props.active_id}
          onSnippetSelected={this.props.onSnippetSelected}
        />  

        <SnippetPages 
          pages={this.props.pages}
          page={this.props.page}
          onPageChanged={this.props.onPageSelected}
        />
      </div>
      );
  }

});

var PlateBox = React.createClass({
  loadStories: function(pattern, page) {
    $.ajax({
      url: '/front/stories',
      dataType: 'json',
      data: {pattern: pattern, page: page},
      cache: false,
      success: function(data)
      {
        this.setState({movies: data});
      }.bind(this)
    });
  },
  loadSnippets: function(params)
  {
    if(!params.story_id)
    {
      return;
    }
    $.ajax({
      url: '/front/stories/'+params.story_id+'/snippets',
      dataType: 'json',
      data: {page: params.page},
      cache: false,
      success: function(data)
      {
        console.log(data.pages);
        this.setState({
          snippets: data.snippets,
          snippets_pages: data.pages,
          snippets_page: data.page
        });
      }.bind(this),
      error: function(xhr, status, err)
      {
        console.log(xhr, status, err);
        this, setState({movies: [], snippets_pages: 0, snippets_page: 0});
      }.bind(this)
    });
  },
  handleMovieSelected: function(movie_id)
  {
    this.setState({movie_id_active: movie_id});
    this.props.player.src = '/front/stories/'+movie_id+'/sound';
    this.props.player.load();
    this.props.player.play();
    this.loadSnippets({story_id: movie_id, page: 0});

  },
  handleSnippetSelected: function(snippet_id)
  {
    this.setState({snippet_id_active: snippet_id})
    this.props.player.src = '/front/snippets/'+snippet_id+'/sound';
    this.props.player.load();
    this.props.player.play();
  },
  handleSentenceFilterChanged: function(new_patern)
  {
    this.setState({pattern: new_patern, movie_id: null});
  },
  handlePatternChange: function(new_patern)
  {
    this.loadStories(new_patern, 0);
  },
  handleMoviePageChanged: function(new_page)
  {
    if(new_page<0 || new_page>= this.state.pages)
    {
      return;
    }
    this.setState({movies_page: new_page});
  },
  handleSnippetPageChanged: function(new_page)
  {
    if(new_page<0 || new_page>=this.state.snippets_pages)
    {
      return;
    }
    this.setState({snippets_page: new_page});
    this.loadSnippets({story_id: this.state.movie_id_active, page: new_page});

  },
  getInitialState: function()
  {
    return {
      snippets: [],
      snippets_page: 0,
      snippets_pages: 0,
      snippet_id_active: null,
      movies: [],
      movies_page: 0,
      movies_pages: 0,
      movie_id_active: null
    }

  },
  componentDidMount: function()
  {
    this.loadStories('', 0);
  },
  render: function() {
    return (
      <div>
        <div className="row">
          <MovieBox 
            onPatternChange={this.handlePatternChange}
            onMovieSelected={this.handleMovieSelected}
            onPageSelected={this.handleMoviePageChanged}
            stories={this.state.movies}
            page={this.state.movies_page}
            pages={this.state.movies_pages}
            active_id={this.state.movie_id_active}
          />
          <SnippetBox 
            onSnippetSelected={this.handleSnippetSelected}
            onPageSelected={this.handleSnippetPageChanged}
            snippets={this.state.snippets}
            page={this.state.snippets_page}
            pages={this.state.snippets_pages}
            active_id={this.state.snippet_id_active}
          />
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <MoviePages 
              page={this.props.page}
              pages={this.props.pages}
            />
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