const BASE ='http://192.168.1.3:9000/';

const API = {
    login : `${BASE}api/login/`,
    paises : `${BASE}api/paises/`,
    departamentos : `${BASE}api/departamentos/`,
    municipios : `${BASE}api/municipios/`,
    barrios : `${BASE}api/barrios/`,
    zonas : `${BASE}api/zonasregistros/`,
    formasPagos : `${BASE}api/tiposdepagos/`,
    usuarios : `${BASE}api/usuarios/`,
    cuentas : `${BASE}api/cuentas/`,
    nits : `${BASE}api/nits/`,
    consecutivos : `${BASE}api/registrodeconsecutivos/`,
    sedes : `${BASE}api/sedes/`,
    centro_costos : `${BASE}api/ccosto/`
}

module.exports = {
    API
}