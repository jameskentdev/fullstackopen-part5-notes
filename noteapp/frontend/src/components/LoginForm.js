const LoginForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div>
      username
      <input type="text" name="Username" id="username" />
    </div>
    <div>
      password
      <input type="password" name="Password" id="password" />
    </div>
    <button type="submit">login</button>
  </form>
);

export default LoginForm;
