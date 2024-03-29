import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IGetSearchMovies, IGetSearchTv, searchMovie } from "../api";
import SearchTv from "../Components/SearchTv";
import { makeImagePath } from "../utils";

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  background: black;
`;

const Slider = styled.div`
  position: relative;
  top: 100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;


const SmallBox = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 120px;
  position: relative;
`;

const SmallTitle = styled.h3`
  font-size: 35px;
`;

const Btn = styled.button`
  left: 250px;
  position: absolute;
  margin-top: 20px;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const offset = 6;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);


  const useMultipleQuery = () => {
    const movies = useQuery<IGetSearchMovies>(["movies", keyword], () => searchMovie(keyword ?? "none")
    );
    //const tv = useQuery<IGetSearchTv>(["tv", keyword], () => searchMovie(keyword ?? "none"));
    return [movies]; 
  };

const [
  {isLoading: loadingMovies, data:movies},
] = useMultipleQuery(); 

const [moviesIndex, setMoviesIndex] = useState(0);
const [movieLeaving, setMovieLeaving] = useState(false);
const toggleMoviesLeaving = () => setMovieLeaving((prev) => !prev);
const increaseMoviesIndex = () => {
  if (movies) {
    if (movieLeaving) return;
    toggleMoviesLeaving();
    const totalMovies = movies.results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;
    setMoviesIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  }
};

  return(
    <Wrapper>
    {loadingMovies ? (
      <Loader>Loading...</Loader>
    ) : (
      <>
        <SmallBox style={{top: 200}}>
          <SmallTitle>Movies Results</SmallTitle>
          <Btn  onClick={increaseMoviesIndex}>Next</Btn>
        </SmallBox>
        <Slider>
          <AnimatePresence initial={false} onExitComplete={toggleMoviesLeaving}>
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={moviesIndex}
            >
              {movies?.results
                
                .slice(offset * moviesIndex, offset * moviesIndex + offset)
                .map((movie) => (
                  <Box
                    layoutId={movie.id + ""}
                    key={movie.id}
                    whileHover="hover"
                    initial="normal"
                    transition={{ type: "tween" }}
                    variants={boxVariants}
                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
        <SearchTv/>
      </>
    )}
  </Wrapper>
);
  
  
      
}
export default Search;
