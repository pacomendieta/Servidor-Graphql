const express=require('express')
const { GraphQLSchema, GraphQLObjectType, GraphQLString, graphql} = require('graphql')
var { buildSchema } = require('graphql');
var { graphqlHTTP } = require('express-graphql');

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
    type Query {
        clientes: [Cliente]
        cliente (id:Int):Cliente
        getCursos: [Curso]
    }
    type Mutation {
        addCliente(id:Int, nombre:String, telefono:String ):Cliente
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
    addCliente: (datos)=>{       //Mutation: addCliente
        var cli = {id:counter, nombre: datos.nombre, telefono:datos.telefono }
        bdclientes.push( cli )
        counter++
        return cli
    },
    getCursos: ()=> {return bdcursos}
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
         source:`{clientes {id nombre}, getCursos{title views} }`,     //query
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