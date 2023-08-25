/* eslint-disable react/prop-types */
import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./CityList.module.css";
import { useCities } from "../context/CitiesContext";

function CityList() {
  const { cities, isLoading } = useCities();
  console.log(cities, isLoading);
  if (isLoading) return <Spinner />;
  if (cities.length === 0)
    return (
      <Message message={"Add your first city by clicking on city on the map"} />
    );

  //   console.log(cities);
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
