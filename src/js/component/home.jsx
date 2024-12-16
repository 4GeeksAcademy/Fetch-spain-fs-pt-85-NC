import React, { useEffect, useState } from "react";
import 'font-awesome/css/font-awesome.min.css';

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [tareas, setTareas] = useState([]);
 
    // Crear usuario
    const crearUsuario = () => {
        fetch("https://playground.4geeks.com/todo/users/nachocordoba", {
            method: "GET",  
            headers: { "Accept": "application/json" }
        })
        .then(responseCheck => {
            if (responseCheck.ok) {
                console.log("El usuario ya existe.");
                return;  
            }

            return fetch("https://playground.4geeks.com/todo/users/nachocordoba", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "nachocordoba" })
            });
        })
        .then(responseCreate => {
            if (responseCreate && !responseCreate.ok) {
                throw new Error("No se pudo crear el usuario");
            }
            console.log("Usuario creado exitosamente.");
        })
        .catch(error => {
            console.error("Error al crear usuario:", error);
        });
    };

// Obtener tareas
const getInfoTareas = () => {
    fetch("https://playground.4geeks.com/todo/users/nachocordoba", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("No se pudieron obtener las tareas");
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos recibidos:", data);  

        if (data && Array.isArray(data.todos)) {  
            setTareas(data.todos);  
            data.todos.forEach(tarea => {
                if (!tarea.id) {
                    console.log('Tarea sin id:', tarea);  
                }
            });
        } else {
            console.error("La propiedad 'todos' no es un array", data);  
        }
    })
    .catch(error => {
        console.error("Error al obtener tareas:", error);
    });
};

    // Agregar tarea
    const agregarTareas = (nuevaTarea) => {
        const tarea = { label: nuevaTarea, is_done: false };
        const tareasActualizadas = Array.isArray(tareas) ? [...tareas, tarea] : [tarea];
    
        fetch("https://playground.4geeks.com/todo/todos/nachocordoba", {
            method: "POST",  
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(tarea),  
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo agregar la tarea");
            }
            return response.json(); 
        })
        .then(data => {
            setTareas(tareasActualizadas);
        })
        .catch(error => {
            console.error("Error al agregar tarea:", error);
        });
    };
        
    // Eliminar tarea
    const eliminarTarea = (tareaId) => {
        console.log('Tarea ID:', tareaId);  
        const tarea = tareas.find(t => t.id === tareaId);  
        if (!tarea) {
            console.error("No se encontró la tarea con el ID:", tareaId);
            return;  
        }
    
        const tareaActualizada = { 
            label: tarea.label,  
            is_done: true         
        };
    
        fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
            method: "PUT",  
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json" 
            },
            body: JSON.stringify(tareaActualizada), 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo actualizar la tarea");
            }
            return response.json();  
        })
        .then(updatedTask => {
            setTareas(tareas.map(t => t.id === tareaId ? updatedTask : t)); 
        })
        .catch(error => {
            console.error("Error al eliminar tarea:", error);
        });
    };
        
    useEffect(() => {
        crearUsuario();
        getInfoTareas();
    }, []);

    return (
        <div className="container">
            <h1 className="text-center mt-5">Mis Tareas</h1>
            <ul className="list-group">
                <li className="list-group-item">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && inputValue.trim() !== "") {
                                agregarTareas(inputValue.trim());
                                setInputValue("");
                            }
                        }}
                        placeholder="Escribe aquí tu tarea"/></li>
                        {Array.isArray(tareas) && tareas.map((item) => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between">
                        <span>{item.label}</span>
                        <i
                            className="fa fa-trash eliminar"
                            onClick={() => eliminarTarea(item.id || index)}  
                        ></i>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;