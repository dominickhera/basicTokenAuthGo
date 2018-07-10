var App = React.createClass({
  componentWillMount: function() {
    this.setupAjax();
    this.parseHash();
    this.setState();
  },
  setupAjax: function() {
    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('access_token')) {
          xhr.setRequestHeader('Authorization',
          'Bearer ' + localStorage.getItem('access_token'));
        }
      }
    });
  },
  parseHash: function(){
    this.auth0 = new auth0.WebAuth({
      domain:       AUTH0_DOMAIN,
      clientID:     AUTH0_CLIENT_ID
    });
    this.auth0.parseHash(window.location.hash, function(err, authResult) {
      if (err) {
        return console.log(err);
      }
      if(authResult !== null && authResult.accessToken !== null && authResult.idToken !== null){
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(authResult.idTokenPayload));
        localStorage.setItem('username', authResult.idTokenPayload.name);
        window.location = window.location.href.substr(0, window.location.href.indexOf('#'))
      }
    });
  },
  setState: function(){
    var idToken = localStorage.getItem('id_token');
    if(idToken){
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  },
  render: function() {
    
    if (this.loggedIn) {
      return (<LoggedIn />);
    } else {
      return (<Home />);
    }
  }
});

var Home = React.createClass({
  authenticate: function(){
    this.webAuth = new auth0.WebAuth({
      domain:       AUTH0_DOMAIN,
      clientID:     AUTH0_CLIENT_ID,
      scope:        'openid profile',
      audience:     AUTH0_API_AUDIENCE,
      responseType: 'token id_token',
      redirectUri : AUTH0_CALLBACK_URL
    });
    this.webAuth.authorize();
  },
  render: function() {
    return (
    <div className="container">
      <div className="col-xs-12 jumbotron text-center">
      <h1>Apple Go Work Example</h1>
    	 <h3>made by dominick Hera</h3>
       <hr></hr>
        <a onClick={this.authenticate} className="btn btn-primary btn-lg btn-login">Sign In</a>
      </div>
    </div>);
  }
});

var LoggedIn = React.createClass({
  logout : function(){
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile');
    location.reload();
  },


  render: function() {
    return (
      <div className="col-lg-12">
      <hr></hr>
        <h1>Apple Go Work Example</h1>
        <h3>made by dominick Hera</h3>
        <hr></hr>
        <span className="pull-right btn btn-lg"><a onClick={this.logout}>Log out</a></span>
        <h3>hello there {localStorage.getItem('username')}</h3>
        <div className="row">
        </div>
      </div>);
  }
});


ReactDOM.render(<App />,
  document.getElementById('app'));