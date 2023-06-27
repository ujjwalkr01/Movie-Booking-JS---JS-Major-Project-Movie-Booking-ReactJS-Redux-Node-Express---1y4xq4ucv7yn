import { fetchMovieAvailability, fetchMovieList } from "./api.js";

let mainContainerElement = document.querySelector(".main-container");

let seatSelectorContainerElement = document.querySelector("#booker");

let seatSelectorHeaderElement = document.querySelector("#booker>h3");

let seatSelectorButtonElement = document.querySelector("#book-ticket-btn");

let seatSelectorGridElement = document.querySelector("#booker-grid-holder");
console.log(seatSelectorGridElement);

let createHtmlElementandAddContent = (elName, content) => {
  let el = document.createElement(elName);
  if (content) {
    el.textContent = content;
  }
  return el;
};
let loader = createHtmlElementandAddContent("p", "loading...");
loader.setAttribute("id", "loader");

let selectedSeatsArr = [];

let fetchSeats = (movieName) => {
  seatSelectorContainerElement.appendChild(loader);
  fetchMovieAvailability(movieName).then((seats) => {
    loader.remove();
    while (seatSelectorGridElement.lastChild) {
      seatSelectorGridElement.removeChild(seatSelectorGridElement.lastChild);
    }
    createSeatsEl(seats);
    createSeatsEl(seats, true);
  });
};
let handleSelectedSeats = (e) => {
  let el = e.target;
  console.log(el);
  if (el.classList.contains("available-seat")) {
    el.classList.toggle("selected-seat");
  }
  if (el.classList.contains("selected-seat")) {
    selectedSeatsArr.push(el.textContent);
  } else {
    selectedSeatsArr = selectedSeatsArr.filter((id) => id !== el.textContent);
  }
  if (selectedSeatsArr.length > 0) {
    seatSelectorButtonElement.classList.remove("v-none");
  } else {
    seatSelectorButtonElement.classList.add("v-none");
  }
};
let createSeatsEl = (availableSeats, nextSeats) => {
  let gridWrapper = createHtmlElementandAddContent("div");
  gridWrapper.classList.add("booking-grid");
  let addValue = nextSeats ? 12 : 0;

  for (let i = 1 + addValue; i < 13 + addValue; i++) {
    let seat = createHtmlElementandAddContent("td", i);
    seat.setAttribute("id", `booking-grid-${i}`);
    let className = availableSeats.includes(i)
      ? "unavailable-seat"
      : "available-seat";
    seat.classList.add(className);
    // if(seat.classList.contains("available-seat")){
    seat.addEventListener("click", handleSelectedSeats);
    // }
    gridWrapper.append(seat);
  }
  seatSelectorGridElement.append(gridWrapper);
};

let createAMovie = (movieData) => {
  let { name, imgUrl } = movieData;
  let anc = document.createElement("a");
  anc.setAttribute("class", "movie-link");
  anc.setAttribute("href", `#${name}`);
  let movieEl = `<div class="movie" data-d="${name}">
    <div class="movie-img-wrapper" style="background-image: url('${imgUrl}'); background-size: cover;">
    </div>
    <h4>${name}</h4>
    </div>`;
  anc.innerHTML = movieEl;
  anc.addEventListener("click", (e) => {
    let { d } = e.target.parentElement.dataset;
    seatSelectorHeaderElement.classList.remove("v-none");
    fetchSeats(d);
  });
  return anc;
};

let addMovieList = () => {
  mainContainerElement.appendChild(loader);
  fetchMovieList().then((movieList) => {
    loader.remove();
    let div = document.createElement("div");
    div.setAttribute("class", "movie-holder");
    mainContainerElement.append(div);
    movieList.forEach((movie) => {
      let movieEl = createAMovie(movie);
      div.append(movieEl);
    });
  });
};

let showFormToAddInformation = () => {
  seatSelectorButtonElement.classList.add("v-none");
  seatSelectorHeaderElement.classList.add("v-none");
  let formEl = `
    <section id="confirm-purchase">
        <h2>Confirm your booking for seat numbers:7,8,9,13,14</h2>
        <form id="customer-detail-form">
            <label for="email">Email</label>
            <input type="email" id="email" required/>
            <br>
            <br>
            <label for="phone">phone No</label>
            <input type="tel" id="phone" required/>
            <br>
            <br>
            <button type="submit">purchase</button>
        </form>
    </section>
    `;
  seatSelectorGridElement.innerHTML = "";
  seatSelectorGridElement.innerHTML = formEl;

  document
    .querySelector("#customer-detail-form")
    .addEventListener("submit", () => {
      let email = document.querySelector("#email").value;
      let phone = document.querySelector("#phone").value;
      seatSelectorGridElement.innerHTML = "";
      let successHtml = `
        <section id="success">
            <h2>Booking details</h2>
            <div>seats:7,8,9,13,14</div>
            <div>Phone No: ${phone}</div>
            <div>Email: ${email}</div>
        </section>
        `;
      seatSelectorGridElement.innerHTML = successHtml;
    });
};

seatSelectorButtonElement.addEventListener("click", () => {
  showFormToAddInformation();
});

addMovieList();
