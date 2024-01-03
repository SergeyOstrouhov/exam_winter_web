let url_routes = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
let api_key = "79ccbf2d-deac-458b-b7af-af4d234c846e";
let url_orders = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders');

// function setPaginationInfo(info) {
//     document.querySelector('.total-count').innerHTML = info.total_count;
//     let start = info.total_count && (info.current_page - 1) * info.per_page + 1;
//     document.querySelector('.current-interval-start').innerHTML = start;
//     let end = Math.min(info.total_count, start + info.per_page - 1);
//     document.querySelector('.current-interval-end').innerHTML = end;
// };

// function createPageBtn(page, classes = []) {
//     let btn = document.createElement('button');
//     classes.push('btn');
//     for (cls of classes) {
//         btn.classList.add(cls);
//     }
//     btn.dataset.page = page;
//     btn.innerHTML = page;
//     return btn;
// };

// function renderPaginationElement(info) {
//     let btn;
//     let paginationContainer = document.querySelector('.pagination');
//     paginationContainer.innerHTML = '';

//     btn = createPageBtn(1, ['first-page-btn']);
//     btn.innerHTML = 'Первая страница';
//     if (info.current_page == 1) {
//         btn.style.visibility = 'hidden';
//     }
//     paginationContainer.append(btn);

//     let buttonsContainer = document.createElement('div');
//     buttonsContainer.classList.add('pages-btns');
//     paginationContainer.append(buttonsContainer);

//     let start = Math.max(info.current_page - 2, 1);
//     let end = Math.min(info.current_page + 2, info.total_pages);
//     for (let i = start; i <= end; i++) {
//         btn = createPageBtn(i, i == info.current_page ? ['active'] : []);
//         buttonsContainer.append(btn);
//     }

//     btn = createPageBtn(info.total_pages, ['last-page-btn']);
//     btn.innerHTML = 'Последняя страница';
//     if (info.current_page == info.total_pages) {
//         btn.style.visibility = 'hidden';
//     }
//     paginationContainer.append(btn);
// };

// function downloadData(page = 1) {

//     let list_of_routes = document.querySelector('.table_routes');
//     let url = new URL();
//     let perPage = document.querySelector('.per-page-btn').value;
//     url.searchParams.append('page', page);
//     url.searchParams.append('per-page', perPage);
//     let searchText = document.querySelector('.search-field').value;
//     if (searchText !== "") url.searchParams.append('q', searchText);
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', url);
//     xhr.responseType = 'json';
//     xhr.onload = function () {
//         renderRecords(this.response.records);
//         setPaginationInfo(this.response['_pagination']);
//         renderPaginationElement(this.response['_pagination']);
//     };
//     xhr.send();
// };

// function searchByName() {
//     let url = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
//     let searchText = document.querySelector('.search-field').value;
//     if (searchText !== "") url.searchParams.append('q', searchText);
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', url);
//     xhr.responseType = 'json';
//     xhr.onload = function () {
//         renderRecords(this.response.records);
//         setPaginationInfo(this.response['_pagination']);
//         renderPaginationElement(this.response['_pagination']);
//     };
//     xhr.send();
// };

function addRoute(route) {
    let table = document.getElementById('table_routes');
    body = table.getElementsByTagName('tbody')[0];
    let newRow = table.insertRow(table.rows.length);
    
    // Добавление ячеек
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);

    // Задание содержимого ячеек
    cell1.innerHTML = route['name'];
    cell2.innerHTML = route['description'];
    cell3.innerHTML = route['mainObject'];
};

async function getListOfRoutes() {
    let cur_url = url_routes;
    cur_url.searchParams.append('api_key', api_key);
    const response = await fetch(cur_url);
    let json = await response.json();
    const routes = json;
    routes.forEach(route => {
        console.log(route);
        addRoute(route);

    });

};


window.onload = function () {
    //downloadData();
    //document.querySelector('.search-btn').onclick = searchByName;
    getListOfRoutes();
};
