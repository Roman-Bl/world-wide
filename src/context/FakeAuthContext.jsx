import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  errorMessage: "",
};

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "Qwerty321",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false, errorMessage: "" };
    case "wrongData":
      return {
        ...state,
        errorMessage:
          "Wrong credentials! It`s a test project, so plaese use the default one 🙂",
      };
    default:
      throw new Error("Unknown action type");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, errorMessage }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // here in real app we would sent request to API to check credentials
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
    else dispatch({ type: "wrongData" });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, errorMessage }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext is called outside Context Provider");
  return context;
}

export { AuthProvider, useAuth };
