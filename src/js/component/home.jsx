import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';


const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [tareas, setTareas] = useState([]);
    const [error, setError] = useState(null);
    const [contadorId, setContadorId] = useState(1);
    const apiURL = "https://playground.4geeks.com/todo/users/nachocordoba";  

    // Crear usuario
    const crearUsuario = async () => {
        try {
            const response = await fetch(apiURL, { method: "GET",
                headers: {"Accept": "application/json"}
             });
    
            if (!response.ok) {
                console.log("El usuario no existe, intentando crear uno nuevo.");
                const createResponse = await fetch(apiURL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: "nachocordoba" }),
                });
    
                if (!createResponse.ok) {
                    console.log("No se pudo crear el usuario.");
                    setError("No se pudo crear el usuario.");
                    return;
                }
    
                console.log("Usuario creado exitosamente.");
            }
        } catch (error) {
            console.log("Error al crear usuario:", error);
            setError("Error al crear usuario.");
        }
    };

    // Obtener tareas
    const getInfoTareas = async () => {
        try {
            const response = await fetch(apiURL, { method: "GET",
                headers: {"Accept": "application/json"}
             });
    
            if (!response.ok) {
                console.log("No se pudieron obtener las tareas.");
                setError("No se pudieron obtener las tareas.");
                return;
            }
    
            const data = await response.json();
            console.log("Tareas obtenidas:", data);
            setTareas(data.todos || []);
        } catch (error) {
            console.log("Error al obtener tareas:", error);
            setError("Error al obtener tareas.");
        }
    };

    // Agregar tarea
    const agregarTareas = async (label) => {
        const nuevaTarea = { id: contadorId, label, is_done: true };
        const nuevasTareas = tareas.concat(nuevaTarea); 
        setContadorId(contadorId + 1);
    
        try {
            const response = await fetch('https://playground.4geeks.com/todo/todos/13', {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    "detail": [
                        {
                            "loc": ["string", 0],
                            "msg": "Missing or incorrect data",
                            "type": "validation_error"
                        }
                    ]
                })
            });
    
            if (!response.ok) {
                console.log("No se pudo agregar la tarea:", response.statusText);
                setError("No se pudo agregar la tarea.");
                return;
            }
            setTareas(nuevasTareas);
            console.log("Tarea agregada exitosamente.");
            console.log(tareas.map(tarea => tarea.id));

        } catch (error) {
            console.log("Error al agregar tarea:", error);
            setError("Error al agregar tarea.");
        }
    };

    // Eliminar tarea
    const eliminarTarea = async (id) => {
        const nuevasTareas = tareas.filter((tarea) => tarea.id !== id); 
        try {
            const response = await fetch('https://playground.4geeks.com/todo/todos/13', {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "detail": [
                        {
                            "loc": ["string", 0],
                            "msg": "Missing or incorrect data",
                            "type": "validation_error"
                        }
                    ]
                }), 
            });
    
            if (!response.ok) {
                const data = await response.json();
                console.log("No se pudo eliminar la tarea:", data);
                setError("No se pudo eliminar la tarea.");
                return;
            }
            setTareas(nuevasTareas); 
            
            console.log("Tarea eliminada exitosamente.");
            await getInfoTareas(); 
        } catch (error) {
            console.log("Error al eliminar tarea:", error);
            setError("Error al eliminar tarea.");
        }
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
                        placeholder="Escribe aquí tu tarea"
                    />
                </li>
                {tareas.length === 0 ? (
                    <li className="list-group-item text-center text-muted">
                        No hay tareas pendientes
                    </li>
                ) : (
                    tareas.map((item, id) => (
                        <li key={id} className="list-group-item d-flex justify-content-between">
                            <span>{item.label}</span>
                            <i
                                className="bi bi-trash eliminar"
                                onClick={() => eliminarTarea(item.id)}
                            ></i>
                        </li>
                    ))
                )}
            </ul>
            {tareas.length > 0 && (
                <div className="text-center mt-2">
                    {tareas.length} {tareas.length === 1 ? "tarea" : "tareas"}
                </div>
            )}
            {error && <p className="text-danger text-center mt-2">{error}</p>}
        </div>
    );
};

export default Home;
