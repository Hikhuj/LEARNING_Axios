// AXIOS GLOBALS
// como para Tokens en este caso, para usarlo global
// El codigo largo es un JSON Web Token
// Se puede usar tambien para validar la accion API usando el header.X-Auth-Token
// para revisar autenticidad
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// GET REQUEST
function getTodos() {

  // METODO 1: LONG, largo para usar AXIOS
  // Hay dos formas de hacer un request
  /*
  axios({
    // Dos metodos
    // tipo de metodo a ejecuta
    method: 'get',
    // URL de donde haremos el request del API
    url: 'https://jsonplaceholder.typicode.com/todos',
    // Tambien podemos pasar parametros para poder obtener ciertos resultados
    // en este caso limitar la cantidad de datos para obtener
    params: {
      _limit: 5
    }
  })
    // Esto es manejo de promeras, el 'res' se puede nombrar como mejor nos convengan
    // al igual que uno variable
    // Al recibir una promesa, podemos controlar que recibir con el fin de hacer mas limpio
    // el Request
    // .then(res => console.log(res))

    // Una forma de hacero es que la prometas retorne solo lo que queremos, por ejemplo solo los datos
    // .then(res => console.log(res.data))

    // Podemos ver de forma ordenada lo que nos retorna de la siguiente forma
    // donde podemos ver el Header, Data y Config.
    .then(res => showOutput(res))
    .catch(err => console.error(err));
    */

  /*** METODO 2: SHORT ***/
  // Esta es una forma
  /*
  axios.get('https://jsonplaceholder.typicode.com/todos', {
    params: {_limit=5}
  })
  */

  // Puede cortarse mas agregando los parametros directo en el URL
  // el GET es la accion por Default al usar Axios, por lo que puede eliminarse la palabra GET tambien
  // pero es mejor no hacerlo asi, por lo que mantener el function word GET es mas legible
  axios
    // Podemos agregar un parametro de timeout para detener el request despues de cierto tiempo
    // en este caso se usan milisegundos (ms)
    .get('https://jsonplaceholder.typicode.com/todos?_limit=5', {timeout: 5000})
    .then(res => showOutput(res))
    .catch(err => console.error(err));
	
}

// POST REQUEST
function addTodo() {
  // POST: Agregar, enviar datos
  // LONG Version
  /*
  axios({
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'New Todo',
      completed: false
    }
  })
    .then(res => showOutput(res))
    .catch(err => console.error(err))
  */
  axios
    .post('https://jsonplaceholder.typicode.com/todos', {
      title: 'New Todo',
      completed: false
    })
    .then(res => showOutput(res))
    .catch(err => console.error(err));

}

// PUT/PATCH REQUEST
function updateTodo() {
  // PUT sobreescribe la entidad completa si ya existe y crea un nuevo recurso
  // si este no existe. Por lo que si enviamos un Payload (<= los literales datos)
  // con solo 3 features de 5 que pueden haber, solo esos 3 se enviaran y actualizaran en la DB
  /*
  axios
    .put('https://jsonplaceholder.typicode.com/todos/1', {
      title: 'Updated Todo',
      completed: true
    })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
  */
  
  // PATCH permite actualizar enfocadamente, lo que permite actualizar 
  // solo lo que necesitamos, en otras palabras, parcialmente
  // incluso podriamos agregar un nuevo feature si no existia
  // pero por obvias razones al usar una DB, debe existir la columna para esto
  axios
    .patch('https://jsonplaceholder.typicode.com/todos/1', {
      title: 'Updated Todo',
      completed: true
    })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// DELETE REQUEST
function removeTodo() {
  axios
    .delete('https://jsonplaceholder.typicode.com/todos/1')
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// SIMULTANEOUS DATA
// REQUEST simultaneos de datos
// En este caso vamos a hacer dos request de dos datos
function getData() {
  // Metodo 1: menos descriptivo
  /*
  axios
    .all([
      axios.get('https://jsonplaceholder.typicode.com/todos'),
      axios.get('https://jsonplaceholder.typicode.com/posts')
    ])
    .then(res => {
      // Aqui vamos a mostrar el OUTPUT de ambos, como es un arreglo de request
      // debemos las consideraciones para acceder a los datos de un array por su Index
      console.log(res[0]);
      console.log(res[1]);
      showOutput(res[1]);
    })
    .catch(err => console.error(err));
  */
  axios
  .all([
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
  ])
  // Axios tiene la funciona .spread que permite ser mas limpio
  // y dar un nombre mas descriptivo, por medio de una Arrow Function
  // y luego indicar lo que queremos hacer mas el nombre de quien queremos usar
  .then(axios.spread((todos, posts) => showOutput(posts)))
  .catch(err => console.error(err));
}

// CUSTOM HEADERS
// Envio de datos en los headers
// Se usa mucho para hacer Request Log in, Rutas protegidas
function customHeaders() {
  // En este caso creamos los parametros para poder enviarse
  // pero los agrupamos en una variable para poder enviarlos
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'someToken'
    }
  }

  axios
    .post(
      'https://jsonplaceholder.typicode.com/todos',
      {
        title: 'New Todo',
        completed: false
      },
      config
    )
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// TRANSFORMING REQUESTS & RESPONSES
// Podemos transformar los datos de cierta manera
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'Hello World'
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      // En este caso, es un ejemplo de que podemos transformar un title
      // de lower case a UPPER CASE
      data.title = data.title.toUpperCase();
      return data;
    })
  }

  axios(options).then(res => showOutput(res))
}

// ERROR HANDLING
// Manejo de errores
function errorHandling() {
  // Podemos hacer que retorne error para un cierto Error Code nada mas
  /*
  axios
    .get('https://jsonplaceholder.typicode.com/todoss')
    .then(res => showOutput(res))
    .catch(err => {
      if(err.response){
        // El servidor responde con un status diferente de 200
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        if(err.response.status === 404){
          alert('Error: Page Not Found');
        }
      } else if (err.request){
        // Request fue hecho pero no hubo respuesta
        console.error(err.request);
      }else{
        console.error(err.message);
      }
    });
  */

  axios
  .get('https://jsonplaceholder.typicode.com/todoss', {
    validateStatus: function(status){
      return status < 500; // En este caso haremos que rechace si el status es mayor a 500, si es menor a 500, retornelo unicamente
    }
  })
  .then(res => showOutput(res))
  .catch(err => {
    if(err.response){
      // El servidor responde con un status diferente de 200
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      if(err.response.status === 404){
        alert('Error: Page Not Found');
      }
    } else if (err.request){
      // Request fue hecho pero no hubo respuesta
      console.error(err.request);
    }else{
      console.error(err.message);
    }
  });
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();

  axios
    .get('https://jsonplaceholder.typicode.com/todos', {
      cancelToken: source.token
    })
    .then(res => showOutput(res))
    .catch(thrown => {
      if(axios.isCancel(thrown)){
        console.log('Request canceled', thrown.message);
      }
    });

    if(true){
      source.cancel('Request canceled!');
    }
}


// INTERCEPTAR REQUEST Y RESPONSES
// Los Interceptors son muy similares a los middlewares
// en donde podemos interceptar el request y hacer algo interesante
// ejecutar alguna funcionalidad cuando se ejecuta alguna accion
axios.interceptors.request.use(
  config => {
    console.log(
      `${config.method.toUpperCase()} request send to ${config.url} at ${new Date().getTime()}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// AXIOS INSTANCE
// De esta forma podemos establecer la base del URL que vayamos a usar y solamente
// usemos /resource con el fin de que sea mas facil y no tener que estar agregando
// el URL en todo lado, sino que sea global
const axiosInstance = axios.create({
  // Otros settings personalizados
  baseURL: 'https://jsonplaceholder.typicode.com'
});

// Asi podemos llamarlo de forma mas sencilla
axiosInstance.get('/comments').then(res => showOutput(res));

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// EVENT LISTENERS
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document.getElementById('transform').addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
