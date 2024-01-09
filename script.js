let url_routes = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
let api_key = "79ccbf2d-deac-458b-b7af-af4d234c846e";

let routes = [];
let currentPage = 1;
const recordsPerPage = 3;
let originalRoutes = [];
let attractionsSet = new Set();
let modal = new bootstrap.Modal(document.getElementById('myModal'));
let modalTitle = document.getElementById('modalTitle');
let modalBody = document.getElementById('modalBody');

let selectedDate = "";
let selectedTime = "";
let selectedOption = "";

// Находим элементы на странице
const dateInput = document.getElementById('date_of');
const timeInput = document.getElementById('time_of');
const selectInput = document.getElementById('amount_people');
const saveButton = document.getElementById('send_data');

// Добавляем обработчики событий для отслеживания изменений в инпутах
dateInput.addEventListener('input', function () {
    selectedDate = this.value;
});

timeInput.addEventListener('input', function () {
    selectedTime = this.value;
});

selectInput.addEventListener('change', function () {
    selectedOption = this.value;
});

// Добавляем обработчик события для кнопки "Save Changes"
saveButton.addEventListener('click', function () {
    // Здесь можно использовать значения переменных (selectedDate, selectedTime, selectedOption)
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
    console.log("Selected Option:", selectedOption);
    hideModal();
    resetModal();
    // Ваш код для сохранения изменений
});
function hideModal() {
    modal.hide();
}
function openModal(guidName) {
    // Находим модальное окно по id
    modalTitle.textContent = `Информация о гиде: ${guidName}`;
    

    // Открываем модальное окно
    modal.show();
}
function resetModal() {
    modalTitle.textContent = '';
    modalBody.innerHTML = '';
}

// Открываем модальное окно при выборе гида
function selectGuid(button) {
    let row = button.parentNode.parentNode;
    let guidName = row.cells[0].innerText;
    openModal(guidName);
}

document.getElementById('close').addEventListener('click', function () {
    hideModal();
    resetModal();
});


function showGuids(guids) {
    let table = document.getElementById('table_guids');
    let body = table.getElementsByTagName('tbody')[0];
    body.innerHTML = '';

    guids.forEach(guid => {
        let newRow = body.insertRow(body.rows.length);

        // Добавление ячеек
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        let cell4 = newRow.insertCell(3);
        let cell5 = newRow.insertCell(4);

        // Задание содержимого ячеек
        cell1.innerHTML = guid['name'];
        cell2.innerHTML = guid['language'];
        cell3.innerHTML = guid['workExperience'];
        cell4.innerHTML = guid['pricePerHour'];

        let selectButton = document.createElement("button");
        selectButton.textContent = "Выбрать";
        selectButton.className = "btn btn-primary select-guid-button"; // Добавляем класс
        selectButton.addEventListener("click", function () {
            selectGuid(this);
        });
        cell5.appendChild(selectButton);
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
    // Получаем родительскую строку кнопки
    let row = button.parentNode.parentNode;
    let routeName = row.cells[0].innerText;

    // Добавляем название маршрута в строку "гиды на маршруте"
    document.getElementById('selectedRoute').textContent = `Гиды на маршруте "${routeName}"`;

    
    routes.forEach(route => {
        if (route['name'] == routeName) {
            console.log(route['id']);
            route_id = route['id'];
        }
    });
    addGuids(route_id);
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
    cell2.innerHTML = route['description'];
    cell3.innerHTML = route['mainObject'];

    let selectButton = document.createElement("button");
    selectButton.textContent = "Выбрать";
    selectButton.addEventListener("click", function () {
        selectRow(this);
    });
    cell4.appendChild(selectButton);
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
function showPage(pageNumber) {
    currentPage = pageNumber;
    showRoutes();
    renderPagination();
}

function createPageBtn(pageNumber, text) {
    const pageBtn = document.createElement('button');
    pageBtn.className = 'btn';
    pageBtn.textContent = text;
    pageBtn.dataset.page = pageNumber;

    if (pageNumber === currentPage) {
        pageBtn.classList.add('active');
    }

    pageBtn.addEventListener('click', function () {
        showPage(parseInt(this.dataset.page));
    });

    return pageBtn;
}

// Функция для отображения пагинации
function renderPagination() {
    const totalPages = Math.ceil(routes.length / recordsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    if (totalPages > 1) { // Показываем пагинацию только при наличии более чем одной страницы
        const firstPageBtn = document.createElement('button');
        firstPageBtn.className = 'btn first-page-btn';
        firstPageBtn.textContent = 'Первая страница';
        firstPageBtn.addEventListener('click', function () {
            currentPage = 1;
            showPage(currentPage);
            renderPagination();
        });

        const prevPageBtn = document.createElement('button');
        prevPageBtn.className = 'btn';
        prevPageBtn.textContent = 'Предыдущая страница';
        prevPageBtn.addEventListener('click', function () {
            currentPage = Math.max(currentPage - 1, 1);
            showPage(currentPage);
            renderPagination();
        });

        if (currentPage > 1) {
            paginationContainer.appendChild(firstPageBtn);
            paginationContainer.appendChild(prevPageBtn);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'btn';
            pageBtn.textContent = i;
            pageBtn.dataset.page = i;
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', function () {
                currentPage = parseInt(this.dataset.page);
                showPage(currentPage);
                renderPagination();
            });
            paginationContainer.appendChild(pageBtn);
        }

        const nextPageBtn = document.createElement('button');
        nextPageBtn.className = 'btn';
        nextPageBtn.textContent = 'Следующая страница';
        nextPageBtn.addEventListener('click', function () {
            currentPage = Math.min(currentPage + 1, totalPages);
            showPage(currentPage);
            renderPagination();
        });

        const lastPageBtn = document.createElement('button');
        lastPageBtn.className = 'btn last-page-btn';
        lastPageBtn.textContent = 'Последняя страница';
        lastPageBtn.dataset.page = totalPages;
        lastPageBtn.addEventListener('click', function () {
            currentPage = totalPages;
            showPage(currentPage);
            renderPagination();
        });

        if (currentPage < totalPages) {
            paginationContainer.appendChild(nextPageBtn);
            paginationContainer.appendChild(lastPageBtn);
        }
    }
}


function handleSearch() {
    const name = document.getElementById('searchInput').value.toLowerCase();
    const obj = document.getElementById('select_obj').value.toLowerCase(); // Приводим к нижнему регистру

    routes = originalRoutes.filter(route => {
        const nameMatch = route.name.toLowerCase().includes(name);
        const objMatch = obj === "выберите объект" || route.mainObject.toLowerCase().includes(obj);
        return nameMatch && objMatch;
    });

    currentPage = 1;
    showPage(currentPage);
    renderPagination();
    
}
async function populateAttractionsOptions() {
    const selectObj = document.getElementById('select_obj');
    selectObj.innerHTML = '<option value="Выберите объект">Выберите объект</option>'; // Очищаем существующие опции

    originalRoutes.forEach(route => {
        const attractions = route.mainObject.split('-').map(attraction => attraction.trim());
        attractions.forEach(attraction => attractionsSet.add(attraction));
    });

    attractionsSet.forEach(attraction => {
        const option = document.createElement('option');
        option.value = attraction;
        option.textContent = attraction;
        selectObj.appendChild(option);
    });
}

function getUniqueObjects(routes) {
    const allObjects = routes.map(route => route.mainObject);
    const uniqueObjects = [...new Set(allObjects)];
    return uniqueObjects;
}

async function getListOfRoutes() {
    let cur_url = url_routes;
    cur_url.searchParams.append('api_key', api_key);
    const response = await fetch(cur_url);
    let json = await response.json();
    routes = json;
    originalRoutes = json; // Сохраняем оригинальный массив
    showRoutes();

    // Заполняем опции в select_obj
    const selectObj = document.getElementById('select_obj');
    const uniqueObjects = getUniqueObjects(json);
    
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
}

window.onload = function () {
    getListOfRoutes();
    document.querySelector('.search-btn').onclick = function () {
        handleSearch();
    };
};
