let url_routes = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
let api_key = "79ccbf2d-deac-458b-b7af-af4d234c846e";
let url_orders = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders');

let routes = [];
let guids = {};
let route_id;


function showGuids(guid) {
    let table = document.getElementById('table_routes');
    body = table.getElementsByTagName('tbody')[0];
    let newRow = table.insertRow(table.rows.length);
    
    // Добавление ячеек
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);

    // Задание содержимого ячеек
    cell1.innerHTML = route['name'];
    cell2.innerHTML = route['description'];
    cell3.innerHTML = route['mainObject'];
    let selectButton = document.createElement("button");
    selectButton.textContent = "Выбрать";
    // selectButton.addEventListener("click", function () {
    //     selectGuid(this);
    // });
    cell4.appendChild(selectButton);
};

async function addGuids(id) {
    let cur_url = url_routes;
    path = url_routes.pathname + "/" + id + '/guids';
    cur_url.pathname = path;
    cur_url.searchParams.append('api_key', api_key);
    const response = await fetch(cur_url);
    let json = await response.json();
    json.forEach(guid => {
        
        console.log(guid);
    });
    
};

function selectRow(button) {
    // Получаем родительскую строку кнопки
    let row = button.parentNode.parentNode;
    row = row.cells[0];
    row = row.innerText;

    // Добавьте здесь код для выполнения действий при выборе строки
    routes.forEach(route => {
        if (route['name'] == row) {
            console.log(route['id']);
            route_id = route['id'];
        }
    });
    addGuids(route_id);
    
}

function addRoute(route) {
    let table = document.getElementById('table_routes');
    body = table.getElementsByTagName('tbody')[0];
    let newRow = table.insertRow(table.rows.length);
    
    // Добавление ячеек
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);

    // Задание содержимого ячеек
    cell1.innerHTML = route['name'];
    cell2.innerHTML = route['description'];
    cell3.innerHTML = route['mainObject'];
    let selectButton = document.createElement("button");
    selectButton.textContent = "Выбрать";
    selectButton.addEventListener("click", function () {
        selectRow(this);
    });
    cell4.appendChild(selectButton);
};

async function getListOfRoutes(page = 1) {
    let cur_url = url_routes;
    cur_url.searchParams.append('api_key', api_key);
    const response = await fetch(cur_url);
    let json = await response.json();
    // json.forEach(route => {
    //     routes.append(route);
    //     console.log(route);
    // });
    routes = json;
    // console.log(routes[0]);
    let rec = 3 * (page - 1);
    for (let i = rec; i < rec + 3; i++) {
        addRoute(routes[i]);
    }
    
};


window.onload = function () {
    //downloadData();
    //document.querySelector('.search-btn').onclick = searchByName;
    //document.querySelector('.search-btn').onclick = searchByName;
    getListOfRoutes();
   
};
