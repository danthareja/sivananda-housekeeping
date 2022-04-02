import React from 'react';
import styled from 'styled-components';

const Link = styled.a``;

const Container = styled.div`
  margin-top: 2rem;
`;

const TextField = styled.input`
  padding: 0.2rem;
  margin: 0.5rem;
`;
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin
`;
const Button = styled.button``;

function Login(props) {
  const { isAuthenticated } = props.auth;
  const [state, setState] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  if (isAuthenticated()) props.history.replace('/');
  return (
    <Container>
      {state ? (
        <LoginContainer>
          <label>
            Username{' '}
            <TextField
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password{' '}
            <TextField
              value={password}
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
          </label>
          <Button onClick={() => props.auth.login({ username, password })}>
            Sign in
          </Button>
        </LoginContainer>
      ) : (
        <h2 style={{ textAlign: 'center' }}>
          You are not logged in! <br /> Please{' '}
          <Link onClick={() => setState(true)}>Log In</Link> to continue.
        </h2>
      )}
    </Container>
  );
}

export default Login;
