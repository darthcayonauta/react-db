import React,{useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {
 
  const baseUrl = "http://localhost/apiFrameworks/"
  const [data,setData] = useState([]);

  //creo estados para controlar el comportamiento del modal, va a ser un estado de tipo booleano
  const [modalInsertar,setModalInsertar] = useState(false);
  const [modalEditar,setModalEditar] = useState(false);
  const [modalEliminar,setModalEliminar] = useState(false);

  //creacion de metodo para abrir y cerrar el modal Insertar
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  //creacion de metodo para abrir y cerrar el modal Editar
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

 //creacion de metodo para abrir y cerrar el modal Eliminar
 const abrirCerrarModalEliminar=()=>{
  setModalEliminar(!modalEliminar);
}

  //creo estados para seleccionar el framework, y escribo c/u de los atributos , o sea , creo un objeto, con data vacia
  const [frameworkSeleccionado,setFrameworkSeleccionado] = useState({
    id:'',
    nombre:'',
    lanzamiento:'',
    desarrollador:''
  });

  //este metodo captura lo que el usuario captura en los input, de acuerdo a lo que escribe
  const handleChange =(e)=>{
    const {name,value} = e.target;
    setFrameworkSeleccionado( (prevState)=>({
      ...prevState,
      [name]:value
    } ))

    console.log(frameworkSeleccionado);
  }

  //captura de datos desde la api
  const peticionGet = async ()=>{
    await axios.get(baseUrl)
    .then( response=>{ 
      //console.log(response.data); 
      setData(response.data);
    }).catch(error =>{
      console.log(error);
    })
  }

//ya, ahora nos referimos a la peticion post
const peticionPost = async ()=>{
  //mandamos la info mediante un formdata, por lo que creamos uno
  const f  = new FormData();
  //escribimos el nombre del atributo y posteriormente su valor
  f.append("nombre",frameworkSeleccionado.nombre);
  f.append("lanzamiento",frameworkSeleccionado.lanzamiento);
  f.append("desarrollador",frameworkSeleccionado.desarrollador);
  f.append("METHOD","POST");

  //pasas los valores a la api
  await axios.post(baseUrl,f)
  .then( response=>{ 
    //concadenas los valores para ser enviados
    setData( data.concat(response.data));
    abrirCerrarModalInsertar();
  }).catch(error =>{
    console.log(error);
  })
}

//ya, ahora nos referimos a la peticion post
const peticionPut = async ()=>{
  //mandamos la info mediante un formdata, por lo que creamos un update
  const f  = new FormData();
  //escribimos el nombre del atributo y posteriormente su valor
  f.append("nombre",frameworkSeleccionado.nombre);
  f.append("lanzamiento",frameworkSeleccionado.lanzamiento);
  f.append("desarrollador",frameworkSeleccionado.desarrollador);
  f.append("METHOD","PUT");

  //pasas los valores a la api, y pasamos el id
  await axios.post(baseUrl,f,{params:{id:setFrameworkSeleccionado.id}  })
  .then( response=>{ 
    //concadenas los valores para ser enviados
    //setData( data.concat(response.data));
    var dataNueva = data;
    dataNueva.map( framework=>{
      if(framework.id === frameworkSeleccionado.id){
        framework.nombre = frameworkSeleccionado.nombre;
        framework.lanzamiento = frameworkSeleccionado.lanzamiento;
        framework.desarrollador = frameworkSeleccionado.desarrollador;
      }
    });
    setData(dataNueva);
    abrirCerrarModalEditar();
  }).catch(error =>{
    console.log(error);
  })
}

const peticionDelete=async()=>{
  var f = new FormData();
  f.append("METHOD", "DELETE");
  await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
  .then(response=>{
    setData(data.filter(framework=>framework.id!==frameworkSeleccionado.id));
    abrirCerrarModalEliminar();
  }).catch(error=>{
    console.log(error);
  })
}


//metodo que usas para seleccionar, lo usas tanto para editar como para eliminar, por eso usas var "caso"
//con esto sabremos que modal es el que se tiene que abrir
const seleccionarFramework=(framework,caso)=>{
  setFrameworkSeleccionado(framework)  ;
  (caso ==="Editar") ? 
  abrirCerrarModalEditar(): 
  abrirCerrarModalEliminar()  
}



  useEffect( ()=>{
    peticionGet();
  },[])


  return (
    <div style={{textAlign:'center'}}>
      <br></br>
      <button type="button" 
              class="btn btn-secondary"
              onClick={ ()=>abrirCerrarModalInsertar() }>
        Insertar
      </button>
      <br/>
      <br/>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>id</th>            
            <th>Nombre</th>            
            <th>Lanzamiento</th>
            <th>Desarrollador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map( frameWork =>(
             
                <tr key={frameWork.id}>
                    <td>{frameWork.id}</td>
                    <td>{frameWork.nombre}</td>
                    <td>{frameWork.lanzamiento}</td>
                    <td>{frameWork.desarrollador}</td>
                    <td>
                      <button className="btn btn-sm btn-success" onClick={()=>seleccionarFramework(frameWork,"Editar")}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>seleccionarFramework(frameWork,"Eliminar")} >Eliminar</button>
                    </td>
                  </tr>            
            ))
          }
        </tbody>
      </table>
      <Modal isOpen={modalInsertar}>
          <ModalHeader>Insertar frameWork</ModalHeader>
          <ModalBody>
            <div class="form-group">
              <label>Nombre</label>          
              <input type="text" className="form-control"  name="nombre"  onChange={handleChange}/>
              <br/>
              <label>Lanzamiento</label>          
              <input type="text" className="form-control" name="lanzamiento" onChange={handleChange}/>
              <br/>
              <label>Desarrollador</label>          
              <input type="text" className="form-control" name="desarrollador" onChange={handleChange}/>
              <br/>
            </div>
          </ModalBody>
          <ModalFooter>
              <button type="button" class="btn btn-primary" onClick={peticionPost}>Insertar</button>
              <button type="button" class="btn btn-danger"
                      onClick={ ()=>abrirCerrarModalInsertar() }
              >Cancelar</button>

          </ModalFooter>
      </Modal>    

      <Modal isOpen={modalEditar}>
          <ModalHeader>Modificar FrameWork</ModalHeader>
          <ModalBody>
            <div class="form-group">
              <label>Nombre</label>          
              <input type="text" className="form-control"  name="nombre"  
              onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.nombre}/>
              <br/>
              <label>Lanzamiento</label>          
              <input type="text" className="form-control" name="lanzamiento" 
              onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.lanzamiento}/>
              <br/>
              <label>Desarrollador</label>          
              <input type="text" className="form-control" name="desarrollador" 
              onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.desarrollador}/>
              <br/>
            </div>
          </ModalBody>
          <ModalFooter>
              <button type="button" class="btn btn-primary" onClick={peticionPut}>Editar</button>
              <button type="button" class="btn btn-danger"
                      onClick={()=>abrirCerrarModalEditar()}
              >Cancelar</button>

          </ModalFooter>
      </Modal>  
      <Modal isOpen={modalEliminar}>
         <ModalBody>
           Estas seguro de eliminar este FrameWork? { frameworkSeleccionado && frameworkSeleccionado.nombre }
           </ModalBody> 
         <ModalFooter>
          <button className='btn btn-danger' onClick={peticionDelete()}>Si</button>
          <button className='btn btn-secondary' onClick={abrirCerrarModalEliminar()}>No</button>


        </ModalFooter> 
      </Modal>    

    </div>
  )
}

export default App;
