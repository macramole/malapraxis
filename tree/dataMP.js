var dataMP = {
    id : "Mala Praxis",
    depth : 0,
    parent : null,
    children : [
        {
            id : "Dirección general",
            children : [
                // {
                //     id : "Coordinación",
                //     children : [
                //         {
                //             id : "Académica"
                //         },
                //         {
                //             id : "Técnica"
                //         }
                //     ]
                // }
                {
                    id : "Coordinación Académica",
                },
                {
                    id : "Coordinación Técnica",
                }
            ]
        },
        {
            id : "Escuela",
            color: 1,
            value : 3,
            shape : "circle",
            children : [
                {
                    id : "Feria de ciencias"
                },
                {
                    id : "Preceptor"
                },
                {
                    id : "Jefe distrital / Inspector",
                    children : [
                        {
                            id : "Dirección",
                            children : [
                                {
                                    id : "Director"
                                },
                                {
                                    id : "Vicedirector"
                                }
                            ]
                        }
                    ]
                },
                {
                    id : "Talleres Extracurriculares"
                },
                {
                    id : "Aula",
                    children : [
                        {
                            id : "Tutores"
                        },
                        {
                            id : "Estudiantes"
                        },
                        {
                            id : "Docentes"
                        }
                    ]
                },
                {
                    id : "Centro de estudiantes"
                },
            ]
        },
        {
            id : "Sistematización",
            children : [
                {
                    id : "Google Drive"
                },
                {
                    id : "Blog de referencias"
                }
            ]
        },
        {
            id : "Secretaría Politicas Universitarias",
            value: 2,
            children : [
                {
                    id : "Voluntariado"
                },
                {
                    id : "Universidad",
                    value : 3,
                    color : 7,
                    shape : "circle",
                    children : [
                        {
                            id : "Difusión",
                            children : [
                                {
                                    id : "Radio",
                                    
                                },
                                {
                                    id : "Sitio web"
                                },
                                {
                                    id : "Videos institucionales"
                                },
                            ]
                        },
                        {
                            id : "Secretaria de Extensión"
                        },
                        {
                            id : "Investigación"
                        },
                        {
                            id : "Lic. en Artes Electrónicas"
                        },
                        {
                            id : "Maestría en Artes Electrónicas"
                        },
                        {
                            id : "Muestras",
                            children : [
                                {
                                    id : "FASE"
                                },
                                {
                                    id : "MUNTREF"
                                },
                            ]
                        }
                    ]
                },
            ]
        },
        {
            id : "Conferencias"
        },
        {
            id : "Congresos"
        },
        {
            id : "Publicaciones"
        },
    ]
};
