import { useEffect, useReducer } from "react";
import { useContext } from "react";
import { createContext } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      console.log("test ", action.payload);
      return { ...state, cities: action.payload, isLoading: false };
    case "city/loaded":
      return { ...state, curCity: action.payload, isLoading: false };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        curCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("Unknow action type");
  }
}

const initialState = {
  cities: [],
  isLoading: false,
  curCity: {},
  error: "",
};

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, curCity, error } = state;

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        console.log(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch (e) {
        dispatch({
          type: "rejected",
          payload: "There was an error fetching the cities",
        });
        console.error(e.message);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === curCity.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (e) {
      dispatch({
        type: "rejected",
        payload: "There was an error fetching the city",
      });
      console.error(e.message);
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();

      // manually update our state so it will be same as remote
      dispatch({ type: "city/created", payload: data });
    } catch (e) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city",
      });
      console.error(e.message);
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      // const data = await res.json();
      dispatch({ type: "city/deleted", payload: id });
      // manually update our state so it will be same as remote
    } catch (e) {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city",
      });
      console.error(e.message);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        curCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
