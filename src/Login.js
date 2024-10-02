import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { TextField, Button, IconButton, Typography, Container, Box, InputAdornment, CircularProgress  } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { auth } from './firebaseConfig'; // Import your Firebase configuration
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true); 
  const [showPassword, setShowPassword] = useState(false); // For showing/hiding password
  const [isLoading, setIsLoading] = useState(false); 
  const [loginError, setLoginError] = useState(null); 

  const provider = new GoogleAuthProvider(); 
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); 
    setIsLoading(true); 
    setLoginError(null);  

    try {
      if (isLoginMode) {
        // Login with existing credentials
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Logged in successfully');
         navigate('/dashboard');
      } else {
        // Create a new user account
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created successfully');
         navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error); 
    } finally {
      setIsLoading(false); 
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken; 
      console.log('Google Sign In successful', token);
       navigate('/dashboard');
    } catch (error) {
      console.error('Google Sign In error:', error);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {isLoginMode ? 'Login' : 'Sign Up'}
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(loginError)}
            helperText={loginError ? loginError.message : ' '} 
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(loginError)}
            helperText={loginError ? loginError.message : ' '} 
          />
          {isLoading && <CircularProgress sx={{ mt: 2 }} />}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoginMode ? 'Login' : 'Sign Up'}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{ mt: 1, mb: 2 }}
          >
            Sign in with Google
          </Button>
          <Typography variant="body2" align="center">
            {isLoginMode ? 'New User? ' : 'Already have an account? '}
            <Button onClick={toggleMode} color="primary">
              {isLoginMode ? 'Sign Up' : 'Login'}
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;