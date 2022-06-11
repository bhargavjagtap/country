import './App.css';
import React,{useState, useEffect} from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [paginate, setPaginate] = useState(8);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const req_headers = new Headers();
    const api_key = "SOybOI0gySWleBOkbrns9RdA1XvKHjs1rlgrFrep";
    req_headers.append("Authorization",`Bearer ${api_key}`);
    req_headers.append("Accept","application/json");

    const req_options = {
      method: "GET",
      headers: req_headers
    };

    fetch("https://countryapi.io/api/all", req_options)
    .then(response => response.json())
    .then(data => {
      setItems(data)
      setLoaded(true)
    },
    (error) => {
      setError(error)
      setLoaded(true)
    }
    );
  }, []);

  console.log(items);
  const data = Object.values(items);

  // Filter
  const filter_items = [...new Set(data.map((item) => item.region))];

  // search function
  function search(items) {
    return items.filter((item) => 
      item.region.includes(filter) && 
      item.name.toLowerCase().includes(query)
    )
  }

  // paginate function
  const load_more = (event) => {
    setPaginate((prevValue) => prevValue + 8);
  };

  if(!loaded) {
    return <div>Loading...</div>
  }
  else if(error) {
    return <div>Error: {error.message}</div>
  }
  else {
  return (
    <div className="wrapper">
      <div className='search-wrapper'>
        <label htmlFor='search-form'>
          <input 
          type="search" 
          placeholder="Search for.." 
          className="search-input" 
          onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className='select'>
          <select
          className="custom-select"
          aria-label="Filter Countries By Region"
          onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Filter by Region</option>
            {filter_items.map((item) => {
              return <option key={item} value={item}>Filter By {item}</option>
            }
            )}
          </select>
          <span className='focus'></span>
      </div>
      <ul className='card-grid'>
        {search(data)
        .slice(0, paginate)
        .map((item) => (
          <li key={item.alpha3Code}>
            <article className="card">
                <div className="card-image">
                  <img src={item.flag.large} alt={item.name} />
                </div>
                <div className="card-content">
                  <h2 className="card-name">Name : {item.name}</h2>
                  <p className="card-text">Capital : {item.capital}</p>
                  <p className="card-text">Region : {item.region}</p>  
                  <p className="card-text">Population : {item.population}</p>
                  <p className="card-text">Timezones : {item.timezones}</p>
                </div>
              </article>
          </li>
        ))}
      </ul>
      <button onClick={load_more}>Load More</button>
    </div>
  );
  }
}

export default App;
