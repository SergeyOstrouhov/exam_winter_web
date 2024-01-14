let url_routes = new URL(
    'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
let api_key = "79ccbf2d-deac-458b-b7af-af4d234c846e";

let routes = [];
let currentPage = 1;
const recordsPerPage = 3;
let originalRoutes = [];
let uniqueObjects = new Set();
let modal = new bootstrap.Modal(document.getElementById('myModal'));
let modalTitle = document.getElementById('modalTitle');
let modalBody = document.getElementById('modalBody');

let selectedDate;
let selectedTime = "";
let selectedOption = "";

let pagination_btn = 'px-1 main_color border-0 m-1 rounded';

const dateInput = document.getElementById('date_of');
const timeInput = document.getElementById('time_of');
const selectInput = document.getElementById('amount_people');
const saveButton = document.getElementById('send_data');

// Добавляем обработчики событий для отслеживания изменений в инпутах
dateInput.addEventListener('input', function () {
    selectedDate = new Date(this.value);
});

timeInput.addEventListener('input', function () {
    selectedTime = this.value;
});

selectInput.addEventListener('change', function () {
    selectedOption = this.value;
});


saveButton.addEventListener('click', function () {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
    console.log("Selected Option:", selectedOption);
    
});
function hideModal() {
    modal.hide();
}
function openModal(guidName) {
    modalTitle.textContent = `Информация о гиде: ${guidName}`;
    modal.show();
}
function resetModal() {
    modalTitle.textContent = '';
    modalBody.innerHTML = '';
}


function selectGuid(button) {
    let row = button.parentNode.parentNode;
    let guidName = row.cells[0].innerText;
    openModal(guidName);
}

document.getElementById('close').addEventListener('click', function () {
    hideModal();
    resetModal();
});

function showAlert(msg) {
    let alertsContainer = document.querySelector('.alerts');
    let newAlertElement = document.getElementById('alerts-template');
    newAlertElement = newAlertElement.cloneNode(true);
    newAlertElement.querySelector('.msg').innerHTML = msg;
    newAlertElement.classList.remove('d-none');
    alertsContainer.append(newAlertElement);
}

function showGuids(guids) {
    let table = document.getElementById('table_guids');
    let body = table.getElementsByTagName('tbody')[0];
    body.innerHTML = '';

    guids.forEach(guid => {
        let newRow = body.insertRow(body.rows.length);

        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        let cell4 = newRow.insertCell(3);
        let cell5 = newRow.insertCell(4);

        cell1.innerHTML = guid['name'];
        cell1.className = 'col-md-2 col-md-px-1 fw-bold';
        cell2.innerHTML = `Язык: ${guid['language']}`;
        cell2.className = 'col-md-2 col-md-px-1';
        cell3.innerHTML = `Опыт работы(в годах): ${guid['workExperience']}`;
        cell3.className = 'col-md-3 col-md-px-1';
        cell4.innerHTML = `Цена за час: ${guid['pricePerHour']} рублей`;
        cell4.className = 'col-md-2 col-md-px-1';

        let selectButton = document.createElement("button");
        selectButton.textContent = "Выбрать";
        selectButton.className = "btn main_color select-guid-button";
        selectButton.addEventListener("click", function () {
            selectGuid(this);
        });
        cell5.appendChild(selectButton);
        cell5.className = 'col-md-3 text-center';
    });
}

async function addGuids(id) {
    let cur_url = url_routes;
    let path = url_routes.pathname + "/" + id + '/guides';
    cur_url.pathname = path;
    cur_url.searchParams.append('api_key', api_key);

    const response = await fetch(cur_url);
    let json = await response.json();

    showGuids(json);
    let selectButtons = document.querySelectorAll('.select-guid-button');
    selectButtons.forEach(button => {
        button.addEventListener('click', function () {
            selectGuid(this);
        });
    });
}


function selectRow(button) {
    let row = button.parentNode.parentNode;
    let routeName = row.cells[0].innerText;

    document.getElementById('selectedRoute').textContent =
    `Гиды на маршруте "${routeName}"`;
    routes.forEach(route => {
        if (route['name'] == routeName) {
            console.log(route['id']);
            route_id = route['id'];
        }
    });
    addGuids(route_id);
}

function createPageBtn(pageNumber, text) {
    const pageBtn = document.createElement('button');
    pageBtn.className = 'btn';
    pageBtn.textContent = text;
    pageBtn.dataset.page = pageNumber;

    pageBtn.addEventListener('click', function () {
        //Я не нзаю как здесь использовать функции ТОЛЬКО после объявления
        showPage(parseInt(this.dataset.page));
    });

    return pageBtn;
}

function addRoute(route) {
    let table = document.getElementById('table_routes');
    let body = table.getElementsByTagName('tbody')[0];
    let newRow = body.insertRow(body.rows.length);

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);

    cell1.innerHTML = route['name'];
    cell1.className = 'fw-bold px-2 border-bottom text-center';
    cell2.innerHTML = route['description'];
    cell2.className = 'py-1 border-bottom';
    cell3.innerHTML = route['mainObject'];
    cell3.className = 'py-1 border-bottom';
    let selectButton = document.createElement("button");
    selectButton.textContent = "Выбрать";
    selectButton.classList.add('main_color');
    selectButton.classList.add('form-control');
    selectButton.addEventListener("click", function () {
        selectRow(this);
    });
    cell4.appendChild(selectButton);
    cell4.className = 'border-bottom text-center';
}

function showRoutes() {
    let rec = recordsPerPage * (currentPage - 1);
    let table = document.getElementById('table_routes');
    let body = table.getElementsByTagName('tbody')[0];
    body.innerHTML = '';

    for (let i = rec; i < rec + recordsPerPage && i < routes.length; i++) {
        addRoute(routes[i]);
    }
}
function renderPagination() {
    const totalPages = Math.ceil(routes.length / recordsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) {
        console.error('Pagination container not found.');
        return;
    }

    paginationContainer.innerHTML = '';

    if (totalPages > 1) { 
        if (currentPage > 1) {
            const firstPageBtn = createPageBtn(1, 'Первая страница');
            const prevPageBtn = createPageBtn(currentPage - 1,
                'Предыдущая страница');
            firstPageBtn.className = pagination_btn;
            prevPageBtn.className = pagination_btn;
            paginationContainer.appendChild(firstPageBtn);
            paginationContainer.appendChild(prevPageBtn);
        }

        const currentPageBtn = createPageBtn(currentPage,
            currentPage.toString());
        currentPageBtn.className = pagination_btn;
        paginationContainer.appendChild(currentPageBtn);

        if (currentPage < totalPages) {
            const nextPageBtn = createPageBtn(currentPage + 1,
                'Следующая страница');
            const lastPageBtn = createPageBtn(totalPages, 'Последняя страница');
            nextPageBtn.className = pagination_btn;
            lastPageBtn.className = pagination_btn;
            paginationContainer.appendChild(nextPageBtn);
            paginationContainer.appendChild(lastPageBtn);
        }
    }
}

function showPage(pageNumber) {
    currentPage = pageNumber;
    showRoutes();
    renderPagination();
    console.log('showPage');
}


function handleSearch() {
    const name = document.getElementById('searchInput').value.toLowerCase();
    const obj = document.getElementById('select_obj').value.toLowerCase(); 

    routes = originalRoutes.filter(route => {
        const nameMatch = route.name.toLowerCase().includes(name);
        let include_obj = route.mainObject.toLowerCase().includes(obj);
        const objMatch = obj === "выберите объект" || include_obj;
        return nameMatch && objMatch;
    });

    currentPage = 1;
    showPage(currentPage);
    renderPagination();
    
}

// function getUniqueObjects(routes) {
//     const allObjects = routes.map(route => route.mainObject);

//     const uniqueObjects = [...new Set(allObjects)];
//     return uniqueObjects;
// }
function getUniqueObjects(routes) {
    const allObjects = routes.flatMap(route => route.mainObject.split('-'));
    const uniqueObjects = [...new Set(allObjects)];
    return uniqueObjects;
}


async function getListOfRoutes() {
    let cur_url = url_routes;
    cur_url.searchParams.append('api_key', api_key);
    try {
        const response = await fetch(cur_url);
        let json = await response.json();
        routes = json;
        originalRoutes = json; 
        showRoutes();
    
        // Заполняем опции в select_obj
        const selectObj = document.getElementById('select_obj');
        uniqueObjects = getUniqueObjects(json);
        
        // Очищаем существующие опции
        while (selectObj.firstChild) {
            selectObj.removeChild(selectObj.firstChild);
        }
    
        // Добавляем новые опции
        const defaultOption = document.createElement('option');
        defaultOption.value = 'Выберите объект';
        defaultOption.text = 'Выберите объект';
        selectObj.add(defaultOption);
    
        uniqueObjects.forEach(object => {
            const option = document.createElement('option');
            option.value = object;
            option.text = object;
            selectObj.add(option);
        });
        renderPagination();
    } catch (error) {
        showAlert('К сожалению, не удалось осуществить вопрос к серверу.');
    }
    
}

window.onload = function () {
    getListOfRoutes();
    document.querySelector('.search-btn').onclick = function () {
        handleSearch();
    };
    showAlert("Замёрзли в Москве? - Наши цены согреют вас!");
};
