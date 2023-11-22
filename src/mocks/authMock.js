const anonUser = {
  acl: null,
  name: "Anonymous",
};

class AuthMock {
  constructor(initialState, mockUser) {
    this.authState = initialState;
    this.mockUser = mockUser;

    console.log('AuthMock constructor');
  }

  setAuthState = (authState) => {
    this.authState = authState;
    console.log('AuthMock setAuthState', authState);
  };

  getAuthState = () => {
    console.log('AuthMock getAuthState');
    return this.authState;
  };

  setStateLoggingIn = () => {
    console.log('AuthMock setStateLoggingIn');
    this.setAuthState({ ...this.authState, user: anonUser, state: "LOGGING_IN" });
  };

  setStateLoggedIn = () => {
    console.log('AuthMock setStateLoggedIn');
    this.setAuthState({ ...this.authState, user: this.mockUser, state: "LOGGED_IN" });
  };
}
  
export const authMock = new AuthMock({
  user: {
    acl: null
  }
});