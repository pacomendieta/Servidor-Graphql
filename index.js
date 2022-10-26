const express=require('express')
const { GraphQLSchema, GraphQLObjectType, GraphQLString, graphql} = require('graphql')

const app = express();


//SERVIDOR HTTP
app.listen(process.env.puerto, ()=>{
    console.log("Servidor http en puerto ", process.env.puerto)
})

//CREAR SQUEMA
const schema = new GraphQLSchema({
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

const mischema = buildSchema(`
    type Query {
        saludo:String
    }
`)
const root = { 
    saludo: ()=>{ console.log('Hola MUndo')}
}


// RUTA / 
app.get ('/',function(req,res) {
    graphql( mischema, ` { message } `)
    .then (respuesta=>res.json(respuesta))
    .catch(error=>console.log(error) )
    res.send("<h1>Pagina Home</h1>")
}  )
