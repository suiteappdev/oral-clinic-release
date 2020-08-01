const axios  = require('axios');
const API = require('../constants/constants').API;

let apiService = function (withAuth){

        this.departamentos = {};
        this.paises = {};
        this.municipios = {};
        this.barrios = {};
        this.zonas = {};
        this.formasPagos = {};
        this.usuarios = {};
        this.cuentas = {};
        this.nits = {};
        this.consecutivos = {};
        this.sedes = {};
        this.centro_costos = {};

        if(withAuth){
            axios.interceptors.request.use((config)=>{
                
                if(localStorage.getItem('session')){
                    config.headers = {
                        'oc-api-key' : `Bearer ${JSON.parse(localStorage.getItem('session')).token}`
                    }
                }

                return config;

              }, (e)=>Promise.reject(e));
        }

        this.Login = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.login}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }

        this.departamentos.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.departamentos}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.departamentos.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.departamentos}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.departamentos.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.departamentos}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.departamentos.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.departamentos).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }

        this.departamentos.ByPais = {
            get  : (pais)=>{
                return new Promise((resolve, reject)=>{
                        axios.get(`${API.departamentos}pais/${pais}`).then((response)=>resolve(response.data)).catch((e)=>reject(e));
                 });
            }
        }
   

        this.municipios.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.municipios}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.municipios.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.municipios}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.municipios.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.municipios}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.municipios.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.municipios).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }

        this.municipios.ByDepartamento = {
            get  : (departamento)=>{
                    return new Promise((resolve, reject)=>{
                        axios.get(`${API.municipios}departamento/${departamento}`).then((response)=>resolve(response.data)).catch((e)=>reject(e));
                    });
             }
        }

        this.paises.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.paises}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.paises.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.paises}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.paises.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.paises}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.paises.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.paises).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }

        /* ZONAS */
        this.zonas.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.zonas}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.zonas.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.zonas}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.zonas.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.zonas}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.zonas.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.zonas).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }

        this.zonas.ByMunicipio = {
            get  : (municipio)=>{
                return new Promise((resolve, reject)=>{
                        axios.get(`${API.zonas}municipio/${municipio}`).then((response)=>resolve(response.data)).catch((e)=>reject(e));
                 });
            }
        }
        /* END ZONAS */

        /* BARRIOS */
        this.barrios.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.barrios}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.barrios.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.barrios}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.barrios.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.barrios}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.barrios.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.barrios).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }

            
        this.barrios.ByZona = {
            get : (zona)=>{
                return new Promise((resolve, reject)=>{
                    axios.get(`${API.barrios}zonasregistros/${zona}`).then((response)=>resolve(response.data)).catch((e)=>reject(e));
                });
            }
        }
        /* END BARRIOS */

        /* TIPOS DE PAGOS */
        this.formasPagos.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.formasPagos}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.formasPagos.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.formasPagos}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.formasPagos.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.formasPagos}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.formasPagos.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.formasPagos).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }
        
        /* END TIPOS DE PAGOS */

         /* TIPOS DE PAGOS */
         this.usuarios.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.usuarios}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.usuarios.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.usuarios}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.usuarios.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.usuarios}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.usuarios.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.usuarios).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }
        
        /* END TIPOS DE PAGOS */

        /* Cuentas */
        this.cuentas.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.cuentas}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.cuentas.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.cuentas}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.cuentas.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.cuentas}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.cuentas.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.cuentas).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }

        this.cuentas.search = {
            get : (query, limit)=>{
                return new Promise((resolve, reject)=>{
                    axios.get(`${API.cuentas}buscar-cuentas?id=${query}&limit=${limit}`).then((response)=>resolve(response.data)).catch((e)=>reject(e));
                });
            }
        }
        
        /* END CUENTAS */

        /* NITS */
        this.nits.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.cuentas}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.nits.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.cuentas}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.nits.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.cuentas}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.nits.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.cuentas).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }

        this.nits.search = {
            get : (query, limit)=>{
                return new Promise((resolve, reject)=>{
                    axios.get(`${API.nits}buscar-nits?id=${query}&limit=${limit}`).then((response)=>resolve(response.data)).catch((e)=>reject(e));
                });
            }
        }
        
        /* END NITS */

        /* CONSECUTIVOS */
        this.consecutivos.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.consecutivos}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.consecutivos.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.consecutivos}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.consecutivos.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.consecutivos}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.consecutivos.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.consecutivos).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }
        /* END CONSECUTIVOS */

        /* SEDES */
        this.sedes.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.sedes}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.sedes.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.sedes}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.sedes.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.sedes}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.sedes.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.sedes).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }
        /* END SEDES */

        /* CENTRO DE COSTOS */
        this.centro_costos.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.centro_costos}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.centro_costos.delete = (id)=>{
            return new Promise((resolve, reject)=>{
                axios.delete(`${API.centro_costos}${id}`).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.centro_costos.put = (id, data)=>{
            return new Promise((resolve, reject)=>{
                axios.put(`${API.centro_costos}${id}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.centro_costos.get = ()=>{
            return new Promise((resolve, reject)=>{
                axios.get(API.centro_costos).then((response)=>resolve(response.data)).catch((e)=>reject(e));
            });
        }
        /* END CENTRO DE COSTOS */
    
    return this;
}

module.exports = {
    apiService
};