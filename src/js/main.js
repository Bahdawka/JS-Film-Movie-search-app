const moviesListElement = document.getElementById('movies-list')
const searchInput = document.getElementById('search')
const searchcheckbox = document.getElementById('checkbox')

let isSearchTriggerEnabled = false
let lastSearchValude = ''

const debounceTime = (() => {
  let timerId = null
  return (cb, ms) => {
    if (timerId) {
      clearTimeout(timerId)
      timerId = null
    }
    timerId = setTimeout(cb, ms)
  }
})()

const addMovieToList = ({ Poster: poster, Title: title, Year: year }) => {
  const item = document.createElement('div')
  const image = document.createElement('img')

  item.classList.add('movie')

  image.classList.add('movie__poster')
  image.src = /^(https?:\/\/)/i.test(poster) ? poster : 'src/img/no-image.png'
  image.alt = `${title} ${year}`
  image.title = `${title} ${year}`

  item.append(image)
  moviesListElement.prepend(item)
}

const getData = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data || !data.Search) throw new Error('The server returned incorect data')
      return data.Search
    })
    .catch(console.log)

const clearMoviesMarkup = () => {
  if (moviesListElement) moviesListElement.innerHTML = ''
}

const inputSearchHandler = (e) => {
  debounceTime(() => {
    const searchValue = e.target.value.trim()
    if (!searchValue || searchValue.length < 4 || searchValue === lastSearchValude) return
    if (!isSearchTriggerEnabled) clearMoviesMarkup()
    getData(`https://www.omdbapi.com/?apikey=8e82c706&s=${searchValue}`).then((movies) =>
      movies.forEach(addMovieToList))
    lastSearchValude = searchValue
  }, 1000)
}

searchInput.addEventListener('input', inputSearchHandler)
searchcheckbox.addEventListener('change', (e) => {
  isSearchTriggerEnabled = e.target.checked
})