import heroImg from "./assets/hero-img.png";
import bgImage from "./assets/hero-bg.png";
import Search from "./components/search";
import { useState,useEffect } from "react"
import Spinner from "./components/spinner";
import MovieCard from "./components/MovieCard";

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  }
};



function App() {
  const [searchTerm,setSearchTerm]=useState('')
  const [errorMessage,setErrorMessage]=useState('')
  const [movieList,setMovieList]=useState([])
  const [isLoading,setIsLoading]=useState(false)
  




  const fetchMovies= async (query = '') => {

    setIsLoading(true);
    setErrorMessage('')


    try {
        const endpoint = query
  ? `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
  : `${TMDB_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

        const response = await fetch(endpoint,API_OPTIONS)

        // alert(response)

        if(!response.ok){
          throw new Error('Failed to fetch movies')
        }

        const data = await response.json()


        if (data.response ==='False'){
          setErrorMessage(data.Error || 'Failed to fetch movies');
          setMovieList([])
          return
        }

        console.log(data)
        setMovieList(data.results || [])


    } catch (error) {
      console.error(`Error fetching movies : ${error}`);
      setErrorMessage(`Error fetching movies.Please try again later.`);
    }finally{
      setIsLoading(false)

    }
  }



 useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchMovies(searchTerm);
  }, 500); // attendre 500ms après la dernière frappe

  return () => clearTimeout(delayDebounce); // annule si l'utilisateur continue à taper
}, [searchTerm]);

  return (
    <>
      <main style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
      }}
>
      <div className="pattern"/>

      <div className="wrapper">

      <header>
      <img src={heroImg} alt="Hero" />
        <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      {/* <h1>{searchTerm}</h1> */}
      </header>
      <section className="all-movies">
        <h2 className="mt-[40px]">
          All Movies
        </h2>

        { isLoading ? (<Spinner/>) : errorMessage ?  (<p className="text-red-500">{errorMessage}</p>) : (
          <ul>
            {movieList.map((movie)=> (
              <MovieCard key={movie.id}  className="text-white" movie={movie}/>
            ))}
          </ul>
        )}
        



      </section>

      
      </div>
      </main>
      
    </>
  )
} 

export default App






