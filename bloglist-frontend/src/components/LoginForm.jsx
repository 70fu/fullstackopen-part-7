import PropTypes from 'prop-types';

const LoginForm = ({ username, setUsername, password, setPassword, handleLogin }) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
                username
        <input
          type="text"
          value={username}
          name="Username"
          id='username-input'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
                password
        <input
          type="password"
          value={password}
          name="Password"
          id='password-input'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id='login-button'>login</button>
    </form>
  )
}

LoginForm.propTypes = {
  username:PropTypes.string.isRequired,
  setUsername:PropTypes.func.isRequired,
  password:PropTypes.string.isRequired,
  setPassword:PropTypes.func.isRequired,
  handleLogin:PropTypes.func.isRequired
}

export default LoginForm;