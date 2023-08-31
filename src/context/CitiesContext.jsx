import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [curCity, setCurCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurCity(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }
  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();

      // manually update our state so it will be same as remote
      setCities((cities) => [...cities, data]);
    } catch (e) {
      alert("There was an error on adding a city");
    } finally {
      setIsLoading(false);
    }
  }
  async function deleteCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      // manually update our state so it will be same as remote
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (e) {
      alert("There was an error on deleting the city");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, curCity, getCity, createCity, deleteCity }}
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
