
var SnippetSearch = React.createClass({
  handlePatternChange: function(e)
  {
    this.setState({pattern: e.target.value});
    this.props.onPatternChange(e.target.value);
  },
  getInitialState: function()
  {
    return (
        {
          pattern: ''
        }
      );
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
var SnippetList = React.createClass({
  handleClick: function(e, snippet_id)
  {
    this.props.onSnippetSelected(snippet_id);
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
    console.log(pages);

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
        
        <SnippetSearch 
          onPatternChange={this.props.onPatternChange}
        />
        <SnippetList 
          onSnippetSelected={this.props.onSnippetSelected}
          snippets={this.props.snippets}
          active_id={this.props.active_id}
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
  loadSnippets: function(words, page)
  {
    if(!words)
    {
      return;
    }
    $.ajax({
      url: '/front/snippets',
      dataType: 'json',
      data: {words: words, page: page},
      cache: false,
      success: function(data)
      {
        this.setState({snippets: data.snippets, snippets_page: data.page, snippets_pages: data.pages});
      }.bind(this),
      error: function(xhr, status, err)
      {
        console.log(xhr, status, err);
      }.bind(this)
    });
  },
  handleSnippetSelected: function(snippet_id)
  {
    this.props.player.src = '/front/snippets/'+snippet_id+'/sound';
    this.props.player.load();
    this.props.player.play();
  },
  handleSnippetfIltercHanged: function(new_patern)
  {
    this.setState({pattern: new_patern});
    this.loadSnippets(new_patern, 0);
  },
  handleSnippetPageChanged: function(new_page)
  {
    this.loadSnippets(this.state.pattern, new_page);
  },
  getInitialState: function()
  {
    return {
      pattern: '',
      snippets: [],
      snippets_page: 0,
      snippets_pages: 0,
      snippet_id_active: null
    }

  },
  render: function() {
    return (
      <div>
        <div className="row">
          
          <SnippetBox 
            onPatternChange={this.handleSnippetfIltercHanged}
            onSnippetSelected={this.handleSnippetSelected}
            onPageSelected={this.handleSnippetPageChanged}
            snippets={this.state.snippets}
            page={this.state.snippets_page}
            pages={this.state.snippets_pages}
            active_id={this.state.snippet_id_active}
          />
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


