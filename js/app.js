let cl = console.log

const showMovieModel = document.getElementById("showMovieModel");
const backDrop = document.getElementById("backDrop");
const movieModel = document.getElementById("movieModel");
const hideMovieModel = [...document.querySelectorAll(".hideMovieModel")];
const titleControl = document.getElementById("title");
const imageUrlControl = document.getElementById("imageUrl");
const ratingControl = document.getElementById("rating");
const overviewControl = document.getElementById("overview");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const movieContainer = document.getElementById("movieContainer");
const movieForm = document.getElementById("movieForm");
const loader = document.getElementById("loader");
const carouselContainer = document.getElementById("carouselContainer");
const trailerDrop = document.getElementById("trailerDrop");
const trailerBtn = document.getElementById("trailerBtn");
const info = document.getElementById("info");
const close = document.getElementById("close");

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })


const snackBarMsg = (msg, icon, timer) => {
    swal.fire({
        title: msg,
        icon: icon,
        timer: timer
    })
}
const objToArr = (obj) => {
    let movieArr = [];
    for (let key in obj) {
        movieArr.push({ ...obj[key], id: key })
    }
    return movieArr

}
const submitUpdateToggle = () => {
    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}

const baseUrl = `https://movie-model-fetch-default-rtdb.asia-southeast1.firebasedatabase.app`;
const moviesUrl = `${baseUrl}/movies.json`;

const makeApiCall = (apiUrl, methodName, msgBody = null) => {
    msgBody = msgBody ? JSON.stringify(msgBody) : null;
    return fetch(apiUrl, {
        method: methodName,
        body: msgBody
    })
        .then(res => res.json())
}

makeApiCall(moviesUrl, "GET", null)
    .then(res => {
        loader.classList.remove("d-none");
        let data = objToArr(res);
        cl(data)
        movieArrTemplating(data.reverse())
        slideTemplating(data);
    })
    .catch(err => {
        cl(err)
    })
    .finally(() => {
        loader.classList.add("d-none");
    })



const movieArrTemplating = (arr) => {
    movieContainer.innerHTML = arr.map(ele => {
        return `<div  class="col-md-4 mb-4" >
        <div class="card mt-4">
            <figure class="movieCard mb-0" id="${ele.id}">
                <div class="movieImg">
                    <img src="${ele.imageUrl}"
                        alt="img" title="img">
                </div>
                <figcaption>
                    <div class="ratingSec text-white">
                        <div class="row">
                            <div class="col-md-9 col-sm-6">
                                <div class="movieName">
                                    <h3>${ele.title}</h3>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6">
                                <div class="rating text-center">
                                ${ele.rating > 7 ? `<p class="bg-success">${ele.rating}</p>` :
                ele.rating >= 4 && ele.rating <= 7 ? `<p class="bg-warning">${ele.rating}</p>` :
                    `<p class="bg-danger">${ele.rating}</p>`}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="overviewSec">
                        <h3>${ele.title}</h3>
                        <em>Overview</em>
                        <p data-toggle="tooltip" data-placement="top" title="${ele.overView}">${ele.overView}</p>
                            <div class="action">
                                <button type="button" class="btn btn-outline-success" onclick="onEdit(this)" >Edit</button>
                                <button type="button" class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
                            </div>
                    </div>
                </figcaption>
            </figure>
        </div>
    </div>
</div>`

    }).join('')
}

const slideTemplating = (obj) => {
    let result = `<div class="carousel-item active">
                    <img src="https://media.themoviedb.org/t/p/w300_and_h450_bestv2/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg" class="d-block w-100" alt="...">
                    <div class="carousel-caption">
                    <div id="slideInfo" class="info">
                        <h1>Spider-Man: Homecoming (2017)</h1>
                        <button id="trailerBtn" onclick="onTrailerBtn(this)" class="btn btn-danger">Watch Trailer</button>
                    </div>
                    </div>
                </div>`;
    obj.forEach(ele => {
        result += `<div class="carousel-item">
                    <img src="${ele.imageUrl}" class="d-block w-100" alt="...">
                    <div class="carousel-caption">
                    <div id="slideInfo" class="info">
                        <h1>${ele.title}</h1>
                        <button id="trailerBtn" onclick="onTrailerBtn(this)" class="btn btn-danger">Watch Trailer</button>
                    </div>
                    </div>
                </div>`
    })
    carouselContainer.innerHTML = result;
}



const onEdit = (ele) => {
    let editId = ele.closest(".movieCard").id;
    cl(editId)
    localStorage.setItem("editId", editId);
    let editUrl = `${baseUrl}/movies/${editId}.json`
    loader.classList.remove("d-none");
    makeApiCall(editUrl, "GET", null)
        .then(res => {
            cl()
            movieModelToggle();
            document.getElementById("movieForm").scrollIntoView();
            titleControl.value = res.title;
            imageUrlControl.value = res.imageUrl;
            ratingControl.value = res.rating;
            overviewControl.value = res.overView;
            submitBtn.classList.add("d-none");

            updateBtn.classList.remove("d-none");
        })
        .catch(err => {
            cl(err)
            snackBarMsg("Something went wrong while fetching the movie data!!", "error", 1500)
        })
        .finally(() => loader.classList.add("d-none"))
}



const onUpdateBtn = () => {
    let updateId = localStorage.getItem("editId");
    let updateObj = {
        title: titleControl.value,
        imageUrl: imageUrlControl.value,
        rating: ratingControl.value,
        overView: overviewControl.value,
        id: updateId
    }
    let updateUrl = `${baseUrl}/movies/${updateId}.json`;
    makeApiCall(updateUrl,"PATCH", updateObj)
        .then(res=>{
            cl(res)
            let card = document.getElementById(res.id);
            cl(card)
            card.innerHTML = `<div class="movieImg">
            <img src="${res.imageUrl}"
                alt="img" title="img">
        </div>
        <figcaption>
            <div class="ratingSec text-white">
                <div class="row">
                    <div class="col-md-9 col-sm-6">
                        <div class="movieName">
                            <h3>${res.title}</h3>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <div class="rating text-center">
                        ${res.rating > 7 ? `<p class="bg-success">${res.rating}</p>` :
        res.rating >= 4 && res.rating <= 7 ? `<p class="bg-warning">${res.rating}</p>` :
            `<p class="bg-danger">${res.rating}</p>`}
                        </div>
                    </div>
                </div>
            </div>
            <div class="overviewSec">
                <h3>${res.title}</h3>
                <em>Overview</em>
                <p data-toggle="tooltip" data-placement="top" title="${res.overView}">${res.overView}</p>
                    <div class="action">
                        <button type="button" class="btn btn-outline-success" onclick="onEdit(this)" >Edit</button>
                        <button type="button" class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
                    </div>
            </div>
        </figcaption>`;
        snackBarMsg("updated successfully!!!","success",1500);
        })
        .catch(err=>{
            cl(err)
        snackBarMsg("something went wrong","error",1500);

        })
        .finally(()=>{
            submitBtn.classList.remove("d-none");
            updateBtn.classList.add("d-none")
            movieForm.reset();
            movieModelToggle()
        })
}

const onDelete = (ele) => {
    let deleteId = ele.closest(".movieCard").id;
    cl(deleteId)
    let deleteUrl = `${baseUrl}/movies/${deleteId}.json`
    Swal.fire({
        title: "Are you sure, You want to delete this movie?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            loader.classList.remove("d-none");
            makeApiCall(deleteUrl, "DELETE", null)
                .then(res => {
                    cl(res)
                    ele.closest(".col-md-4").remove();
                    snackBarMsg(`Movie deleted successfully!!`, "success", 1500);
                })
                .catch(err => {
                    cl(err)
                    snackBarMsg(`Something went wrong while deleting the movie!!`, "error", 1500);
                })
                .finally(() => {
                    loader.classList.add("d-none");
                })
        }
    });


}

const createCard = (obj) => {
    let card = document.createElement("div");
    card.className = `col-md-4 mb-4`;
    card.innerHTML = `<div class="card mt-4">
                                <figure class="movieCard mb-0" id="${obj.id}">
                                    <div class="movieImg">
                                        <img src="${obj.imageUrl}"
                                            alt="img" title="img">
                                    </div>
                                    <figcaption>
                                        <div class="ratingSec text-white">
                                            <div class="row">
                                                <div class="col-md-9 col-sm-6">
                                                    <div class="movieName">
                                                        <h3>${obj.title}</h3>
                                                    </div>
                                                </div>
                                                <div class="col-md-3 col-sm-6">
                                                    <div class="rating text-center">
                                                    ${obj.rating > 7 ? `<p class="bg-success">${obj.rating}</p>` :
            obj.rating >= 4 && obj.rating <= 7 ? `<p class="bg-warning">${obj.rating}</p>` :
                `<p class="bg-danger">${obj.rating}</p>`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="overviewSec">
                                            <h3>${obj.title}</h3>
                                            <em>Overview</em>
                                            <p data-toggle="tooltip" data-placement="top" title="${obj.overView}">${obj.overView}</p>
                                                <div class="action">
                                                    <button type="button" class="btn btn-outline-success" onclick = "onEdit(this)">Edit</button>
                                                    <button type="button" class="btn btn-outline-danger" onclick = "onDelete(this)">Delete</button>
                                                </div>
                                        </div>
                                    </figcaption>
                                </figure>
                            </div>`
    movieContainer.prepend(card)
}

const onMovieForm = (eve) => {
    eve.preventDefault();
    let newMovie = {
        title: titleControl.value,
        imageUrl: imageUrlControl.value,
        rating: ratingControl.value,
        overView: overviewControl.value
    }
    loader.classList.remove("d-none")
    makeApiCall(moviesUrl, "POST", newMovie)
        .then(res => {
            cl(res)
            newMovie.id = res.name;
            createCard(newMovie)
            snackBarMsg(`New movie ${newMovie.title} added successfully!!!`, "Success", 1500)
        })
        .catch(err => {
            cl(err)
            snackBarMsg(`Something went wrong while adding movie`, "error", 1500)

        })
        .finally(() => {
            loader.classList.add("d-none");
            movieForm.reset();
            movieModelToggle();
        })

}





const movieModelToggle = () => {
    backDrop.classList.toggle("d-none");
    movieModel.classList.toggle("d-none");
}



hideMovieModel.forEach(ele => {
    ele.addEventListener("click", movieModelToggle)
})
showMovieModel.addEventListener("click", movieModelToggle)
movieForm.addEventListener("submit", onMovieForm);
updateBtn.addEventListener("click", onUpdateBtn)
const onTrailerBtn = () => {
    trailerDrop.classList.remove("d-none");
}
const onCloseBtn = () => {
    trailerDrop.classList.add("d-none");
}
close.addEventListener("click", onCloseBtn)
