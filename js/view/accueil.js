import {fetchTodos, createTodo, deleteTodo, updateTodo} from "../api/task.js";
import {setTodos, getTodos, setTodo, getTodo, unsetTodo} from "../idb.js";

export default function Todo(page, data) {
    page.innerHTML = '';
    const constructor = document.createElement('div');
    constructor.innerHTML = `
    <div class="card">
  <section>
  <div>
    <div class="d-flex justify-content-center">
   
      <form>
  <div>
    <div>
      <label>
      Nom de la tâche :
      </label>
    </div>
    <div class="d-flex justify-content-center">
      <input class="name bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="name" type="text" name="name">
    </div>
  </div>
  <div>
    <div>
      <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-username">
      Description de la tâche :
      </label>
    </div>
    <div>
      <input class="content bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="content" name="content" type="text">
    </div>
  </div>
  <div>

  <div>
    <div>
      <button id="addTask" class="button rounded" type="button">
        Ajouter
      </button>
    </div>
  </div>
</form>   
    </div>
    </div>
    </section>
    
    <section>
  <div>
  <hr class='pt-1 pb-1'>
  <ul>

  <div class="flex flex-col text-center todolist">
    </div>
   
  <div>
    
  </div>
    </ul>
    </div>
    </section>

    </div>
  `;

let dataToSave = [];

const card = constructor.querySelector('.card').cloneNode(true);

var button = card.querySelector('#addTask');
button.addEventListener("click", () => {
    let name = card.querySelector('#name');
    let content = card.querySelector('#content');
    let state = false;

    if(!document.offline) {
        const data = {
            id: Date.now(),
            name: name.value,
            content: content.value, 
            state: state,
            date: Date.now()
        };

        createTodo(data).then(() => {
            let chril = card.querySelector('.todolist').cloneNode(true)
            chril.innerHTML = "<span class='pb-10'><input class='checkbox' type='checkbox' id='checkbox-"+ data.id +"'> " + data.name + " - " + data.content +`  <a class='button rounded' href="/task/${data.id}" >Voir</a>`+"  <button type='button' id='button-"+ data.id +"'>Supprimer</button> </span> <hr class='pt-1 pb-1'>";
            card.appendChild(chril);
            var checkbox = card.querySelector('#checkbox-'+ data.id);
            checkbox.addEventListener("change", function() {
                getTodo(data.id).then(result=>{
                    if(checkbox.checked){
                        result.state = true;
                    }else {
                        result.state = false;
                    }
                    setTodo(result);
                    updateTodo(result);
                });
            });
            var button = card.querySelector('#button-'+ data.id);
            button.addEventListener("click", function(){
                const result = deleteTodo(data.id);
                if (result !== false) {
                    unsetTodo(data.id);
                    card.removeChild(chril)
                }
            })
        })
    }
    else{
        const data = {
            id: Date.now(),
            name: name,
            content: content, 
            state: state,
            date: Date.now()
        };

        setTodo(data).then(() => {
            dataToSave.push(data);
            let chril = card.querySelector('.todolist').cloneNode(true)
            chril.innerHTML = "<span class='pb-10'><input class='checkbox' type='checkbox' id='checkbox-"+ data.id +"'> " + data.name + " - " + data.content +`  <a class='button rounded' href="/task/${data.id}" >Voir</a>`+"  <button type='button' id='button-"+ data.id +"'>Supprimer</button> </span> <hr class='pt-1 pb-1'>";
            card.appendChild(chril);
            var checkbox = card.querySelector('#checkbox-'+ data.id);
            checkbox.addEventListener("change", function() {
                getTodo(data.id).then(result=>{
                    if(checkbox.checked){
                        result.state = true;
                    }else {
                        result.state = false;
                    }
                    setTodo(result);
                    updateTodo(result);
                });
            });
            var button = card.querySelector('#button-'+ data.id);
            button.addEventListener("click", function(){
                const result = deleteTodo(data.id);
                if (result !== false) {
                    unsetTodo(data.id);
                    card.removeChild(chril)
                }
            })
        })
    }
    name.value = content.value = "";
}, false); 

window.addEventListener('online', () => {
    if(dataToSave.length > 0){
        dataToSave.map(data => {
          createTodo(data)
        })
        dataToSave = [];
    }
});

if(!document.offline){
    fetchTodos().then(
        result => {
            setTodos(result)
            result.map(data=>{
                let chril = card.querySelector('.todolist').cloneNode(true)
                if(data.state == 0){
                    chril.innerHTML = "<span class='pb-10'><input class='checkbox' type='checkbox' id='checkbox-"+ data.id +"'> " + data.name + " - " + data.content +`  <a class='button rounded' href="/task/${data.id}" >Voir</a>`+"  <button type='button' id='button-"+ data.id +"'>Supprimer</button> </span> <hr class='pt-1 pb-1'>";
                }
                else{
                    chril.innerHTML = "<span class='pb-10'><input class='checkbox' type='checkbox' checked id='checkbox-"+ data.id +"'> " + data.name + " - " + data.content +`  <a class='button rounded' href="/task/${data.id}" >Voir</a>`+" <button type='button' id='button-"+ data.id +"'>Supprimer</button> </span> <hr class='pt-1 pb-1'>";
                }
                card.appendChild(chril);
                var checkbox = card.querySelector('#checkbox-'+ data.id);
                checkbox.addEventListener("change", function() {
                    getTodo(data.id).then(result=>{
                        if(checkbox.checked){
                            result.state = true;
                        }else {
                            result.state = false;
                        }
                        setTodo(result);
                        updateTodo(result);
                    });
                });
                var button = card.querySelector('#button-'+ data.id);
                button.addEventListener("click", function(){
                    const result = deleteTodo(data.id);
                    if (result !== false) {
                        unsetTodo(data.id);
                        card.removeChild(chril)
                    }
                })
            })
        }
    )
}
else{
    getTodos().then(result=>{
        result.map(data=>{
            let chril = card.querySelector('.todolist').cloneNode(true)
            if(data.state == 0){
                chril.innerHTML = "<span class='pb-10'><input class='checkbox' type='checkbox' id='checkbox-"+ data.id +"'> " + data.name + " - " + data.content +`  <a class='button rounded' href="/task/${data.id}" >Voir</a>`+" <button type='button' id='button-"+ data.id +"'>Supprimer</button> </span> <hr class='pt-1 pb-1'>";
            }
            else{
                chril.innerHTML = "<span class='pb-10'><input class='checkbox' type='checkbox' checked id='checkbox-"+ data.id +"'> " + data.name + " - " + data.content +`  <a class='button rounded' href="/task/${data.id}" >Voir</a>`+" <button type='button' id='button-"+ data.id +"'>Supprimer</button> </span> <hr class='pt-1 pb-1'>";
            }
            card.appendChild(chril);
            var checkbox = card.querySelector('#checkbox-'+ data.id);
            checkbox.addEventListener("change", function() {
                getTodo(data.id).then(result=>{
                    if(checkbox.checked){
                        result.state = true;
                    }else {
                        result.state = false;
                    }
                    setTodo(result);
                    updateTodo(result);
                });
            });
            var button = card.querySelector('#button-'+ data.id);
            button.addEventListener("click", function(){
                const result = deleteTodo(data.id);
                if (result !== false) {
                    unsetTodo(data.id);
                    card.removeChild(chril)
                }
            })
        })
    })
}

page.appendChild(card);
return card;
};
