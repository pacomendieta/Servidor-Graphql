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


const root = { 
    saludo:   ()=>{ console.log('Hola MUndo')},
    clientes: ()=>{ return clientes },
    addCliente: (datos)=>{
        var cli = {id:counter, nombre: datos.nombre, telefono:datos.telefono }
        clientes.push( cli )
        counter++
        return cli
    }
}


// RUTA / 
app.get ('/',function(req,res) {
    //graphql( mischema, ` { message } `)
    //.then (respuesta=>res.json(respuesta))
    //.catch(error=>console.log(error) )
    res.render("paghome")
}  )

let clientes=[];
let counter=1;
let schemaClientes = buildSchema(`
    type Cliente {
        id: Int
        nombre: String
        telefono: String
    }
    type Query {
        clientes: [Cliente]
        cliente(id:Int):Cliente
    }
    type Mutation {
        addCliente(id:Int, nombre:String, telefono:String ):Cliente
    }
`)

app.use('/graphql', graphqlHTTP({
    schema: schemaClientes,
    rootValue: root,
    graphiql: true,
}));
 


//SERVIDOR HTTP
app.listen(process.env.puerto, ()=>{
    console.log("Servidor http en puerto ", process.env.puerto)
})
app.set('view engine', 'ejs');