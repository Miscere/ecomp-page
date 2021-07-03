
var PROFESSORS = [];
var QSL = [];
var isFilterApplied = false;

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function populateQSL(json) {
	let series = Object.keys(json).length;
	let table = document.querySelector('table.qsl');
	QSL = json;

	for (let row_index=0; row_index<series; row_index++)
	{
		let row = document.createElement('tr');

		QSL[row_index].forEach((elem, col_index) => {
			let col = document.createElement('td');

			col.setAttribute('class', elem.class);
			col.setAttribute('colspan', elem.colspan);

			if (elem.hours != null) {
				col.addEventListener('click', e => { openModalDisciplina(row_index, col_index); });
				col.innerHTML = `<b>${elem.name}</b></br>${elem.type}</br>${elem.hours}h`;
			}

			row.appendChild(col);
		});

		table.appendChild(row);
	}
}

function populateProfessors(json) {
	let table = document.querySelector('table.professors');
	let datalist = document.querySelector('datalist#searchs');
	PROFESSORS = json.all

	PROFESSORS.forEach((professor, index) => {
		let row = document.createElement('tr');

		row.addEventListener('click', e => { openModalProfessors(index); });
		
		let name 			= document.createElement('td');
		let titulacao = document.createElement('td');
		let vinculo	  = document.createElement('td');

		name.innerHTML      = professor.name;
		titulacao.innerHTML = professor.titulacao;
		vinculo.innerHTML   = professor.vinculo;

		row.appendChild(name);
		row.appendChild(titulacao);
		row.appendChild(vinculo);

		table.appendChild(row);

		addDatalistElement(datalist, professor.name);
	});
}

function openModalDisciplina(row, col) {
  document.querySelector('h3#disciplina').innerHTML = QSL[row][col].name_full;
  document.querySelector('span#serie').innerHTML = QSL[row][col].serie;
  document.querySelector('span#type').innerHTML = QSL[row][col].type;
  document.querySelector('span#horas').innerHTML = QSL[row][col].hours;
  document.querySelector('p#ementa').innerHTML = QSL[row][col].ementa;
  document.querySelector('span#creditos').innerHTML = parseInt(QSL[row][col].hours)/15;

	document.querySelector('#modal_disciplinas').classList.remove('hidden');
}

function openModalProfessors(index) {
  document.querySelector('p#nome').innerHTML = PROFESSORS[index].name;
	document.querySelector('ul#disciplinas').innerHTML = '';

  PROFESSORS[index].disciplinas.forEach((disciplina) => {
    let disciplina_li = document.createElement('li');
    disciplina_li.innerHTML = disciplina;
    document.querySelector('ul#disciplinas').appendChild(disciplina_li);
  });

  document.querySelector('#modal_professores').classList.remove('hidden');
}

function closeModal(modal_id) {
  document.querySelector(modal_id).classList.add('hidden');
}

function backdropCloseModal(){
  let modal = document.querySelector('.modal-container:not(.hidden)');
  if(event.path[0] == modal) { modal.classList.add('hidden'); }
}

function addDatalistElement(datalist, element)
{
	let option = document.createElement('option');
	option.setAttribute('value', element);
	datalist.appendChild(option);
}

function search(table_class)
{
	if (isFilterApplied) { removeFilter(table_class, false); }

	let value = document.querySelector(`input#search-bar.${table_class}`).value.toLowerCase();

	if (value.length <= 1) { return; }

	let table = document.querySelector(`table.${table_class}`);

	for (var i = 1, row; row = table.rows[i]; i++) {
		if (row.cells[0].innerHTML.toLowerCase().includes(value) == false) {
			row.style.display = 'none';
		}
	}

	isFilterApplied = true;
	document.querySelector(`#remove-filter.${table_class}`).style.display = 'block';
}

function removeFilter(table_class, clean_input = true)
{
	let table = document.querySelector(`table.${table_class}`);
	
	for (var i = 1, row; row = table.rows[i]; i++) {
		row.style.display = 'table-row';
	}

	isFilterApplied = false;
	document.querySelector(`#remove-filter.${table_class}`).style.display = 'none';

	if (clean_input) {
		cleanInputSearch(table_class);
	}
}

function cleanInputSearch(table_class)
{
	let search_bar = document.querySelector(`#search-bar.${table_class}`)
	search_bar.value = '';
	search_bar.focus();
}