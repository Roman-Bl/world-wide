import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";

function CityList({ cities, isLoading }) {
  console.log(cities, isLoading);
  if (isLoading) return <Spinner />;
  if (cities.length === 0)
    return (
      <Message message={"Add your first city by clicking on city on the map"} />
    );
  const countriesUniques = cities.reduce((acc, cur) => {
    if (!acc.map((el) => el.country).includes(cur.country))
      return [...acc, { country: cur.country, emoji: cur.emoji }];
    else return acc;
  }, []);
  console.log(countriesUniques);
  return (
    <ul className={styles.countryList}>
      {countriesUniques.map((country) => (
        <CountryItem country={country} />
      ))}
    </ul>
  );
}

export default CityList;
