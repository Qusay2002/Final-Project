
// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ProfilePage from './ProfilePage';
import Weather from './Weather';


const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {

    setUser(userData);
  };

  const handleLogout = () => {

    setUser(null);
  };

  return (
    <Router>
      <Switch>
        <Route path="/login">
          {user ? <Redirect to="/profile" /> : <LoginForm onLogin={handleLogin} />}
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/profile" /> : <RegisterForm onRegister={handleLogin} />}
        </Route>
        <Route path="/profile">
          {user ? <ProfilePage user={user} onLogout={handleLogout} /> : <Redirect to="/login" />}
        </Route>
        <Route path="/weather">
          {user ? <Weather /> : <Redirect to="/login" />}
        </Route>
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
};

export default App;
