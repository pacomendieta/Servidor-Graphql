const express=require('express')
const { GraphQLSchema, GraphQLObjectType, GraphQLString, graphql} = require('graphql')
var { buildSchema } = require('graphql');
var { graphqlHTTP } = require('express-graphql');
const { updateFunctionExpression } = require('typescript');

const app = express();


//CREAR SQUEMA 
const schema =  new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "RootQueryType",
        fields: {
            message : {
                type: GraphQLString,
                resolve() {
                    return "Mensaje, valor del campo message"
                }
            }
        }
    })
})





// RUTA / 
app.get ('/',function(req,res) {
    //graphql( mischema, ` { message } `)
    //.then (respuesta=>res.json(respuesta))
    //.catch(error=>console.log(error) )
    res.render("paghome")
}  )



//Definir SCHEMA
let schemaClientes = buildSchema(`
    input CursoInput {
        title: String!
        views: Int
    }
    input ClienteInput {
        nombre: String
        telefono: String
    }
    type Cliente {
        id: Int
        nombre: String
        telefono: String
    }
    type Curso {
        id: ID!
        title: String!
        views: Int
    }
    type Mensaje {
        mensaje: String
    }
    type Query {
        clientes: [Cliente]
        cliente (id:Int):Cliente
        getCursos(pagina:Int=0,porpagina:Int=5): [Curso]
        getCurso(id:ID):Curso
    }
    type Mutation {
        addCliente(input:ClienteInput ):Cliente
        addCurso(input:CursoInput):Curso
        updateCurso(id:ID, input:CursoInput):Curso
        deleteCurso(id:ID):Mensaje
    }
`)
//Definir ROOT: Funciones usadas en el SCHEME
let bdclientes=[{id:1,nombre:'paco', telefono:'616444444'}];
bdcursos = require('./cursos.js')
//let bdcursos=[{title:'curso 1', views:19}]
let counter=1;
const root = { 
    cliente:   (datos)=>{ return bdclientes[datos.id-1]}, //Query 'cliente'
    clientes: ()=>{ return bdclientes },                  //Query 'clientes'
    addCliente: ({input})=>{       //Mutation: addCliente
        const {nombre,telefono} = input
        var cli = {id:counter, nombre: nombre, telefono: telefono }
        bdclientes.push( cli )
        counter++
        return cli
    },
    getCursos: ({pagina,porpagina})=> {
        return bdcursos.slice(pagina*porpagina, (pagina+1)*porpagina)
    },
    getCurso( {id} ) {
        return bdcursos.find((curso)=>curso.id ==id )
    },
    addCurso({input}) {
        const {title,views} = input
        const curso = {title,views,id:String(bdcursos.length +1)}
        bdcursos.push(curso)
        return curso
    },
    updateCurso({id,input} ){
        const {title, views} = input
        const pos = bdcursos.findIndex((curso)=>curso.id==id )
        if (!pos) return null;
        const curso = {id, ...input}
        bdcursos[pos] = curso
        return curso
    },
    deleteCurso({id}) {
        bdcursos = bdcursos.filter((curso)=>curso.id != id )
        return { mensaje: `El curso con id=${id} ha sido eliminado`}
    }
    
}

//PAGINA HTML CON CLIENTE graphQL online
app.use('/graphql', graphqlHTTP({
    schema: schemaClientes,
    rootValue: root,
    graphiql: true,  //true:  PAGINA HTML CON CLIENTE graphQL online
}));
 
app.use('/clientes', function(req,res) {
    graphql( 
        {
         schema: schemaClientes,              //objeto schema
         source:`{clientes {id nombre}, getCursos{title views} }`,  //query a mostrar
         rootValue: root                      //objeto root
        })
    .then(r=>{ res.send(r) })
    .catch(error=>{console.log("Error:",error); res.send("Error:")})
});


//SERVIDOR HTTP
app.listen(process.env.puerto, ()=>{
    console.log("Servidor http en puerto ", process.env.puerto)
})
app.set('view engine', 'ejs');