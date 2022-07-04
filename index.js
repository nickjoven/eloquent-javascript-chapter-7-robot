// Goal is to create a delivery robot that picks up and drops off parcels
// The robot exists in a virtual village initially represented by the roads between
// each point
// I copied the reading into the readme, and I'm coding along with the readme and 
// adding comments to break down the code. Some times I rename parameters to be
// more specific.

const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

// Each element in the array is ordered alphabetically and consist of two parts:
// "start point-end point" with a "-" character in between

// I guessed what the map could look like and added a .png of the drawing. It has 14
// roads and our array has 14 elements, so it should be ok.

// We need to take the array of strings and create a data structure that tells us
// what each location is, and what locations can be reached from it

// If it looks like I can rewrite a function as an arrow funciton, I'm doing it
// so some of these may differ slightly than the readme

// the function will take in our roads array as an argument. 
// the purpose of the function is to use roads to create something like this:
// graph = {
//     "Alice's House": ["Bob's House", "Cabin", "Post Office"],
//     "Bob's House": ["Alice's House", "Town Hall"]
// } 
const buildGraph = (edges) => {
    // we create a graph object that has no default properties with Object.create(null)
    let graph = Object.create(null)
    // we create an addEdge function that will take a [start, end] do one of two things
    // that will make more sense when we invoke the function.
    const addEdge = (start, end) => {
        if (graph[start] == null) {
            graph[start] = [end]
        } else {
            graph[start].push(end)
        }
    }
    // next we need loop that will iterate over over every element in our roads
    // array (or whatever array we pass into the function). 
    for (let [start, end] of edges.map((element) => element.split('-'))) {
            addEdge(start, end)
            addEdge(end, start)
    }

    // The use of the one line function makes that look clean but hard to interpret
    // (to me), here is what the code would look like as 5 lines instead of 4

    // edges.map((element) => {
    //     let [start, end] = element.split("-")
    //     addEdge(start, end)
    //     addEdge(end, start)
    // })
    
    // Personally? One line functions are too spooky for me. It's much easier to 
    // understand that we're iterating over the array with .map, then splitting
    // each element with .split, then doing the addEdge stuff.
    // Condensing the .map method and .split method onto one line hurts my small brain

    // don't forget to return.
    return graph
}

// We're done with that function
// Next we create a shorthand version of builGraph(roads) as a variable

const roadGraph = buildGraph(roads);

// and we can check our work with console.log
console.log(roadGraph)

// Alice's House: (3) ["Bob's House", 'Cabin', 'Post Office']
// Bob's House: (2) ["Alice's House", 'Town Hall']
// Cabin: ["Alice's House"]
// ETC

// I want to follow one example through, line by line.

// 
const exampleRoads = ["Alice's House-Bob's House", "Alice's House-Cabin",]

const addExampleEdge = (start, end, obj) => {
    if (obj[start] == null) {
        obj[start] = [end]
        console.log(`adding value ${end} to obj[${ start }]`)
    } else {
        obj[start].push(end)
        console.log(`pushing ${end} into obj[${start}]`)
    }
}

const buildExampleGraph = (edges) => {
    let graph = Object.create(null)
    edges.map((element) => {
        let [start, end] = element.split('-')
        addExampleEdge(start, end, graph)
        addExampleEdge(end, start, graph)
    })
    return graph
}

console.log(buildExampleGraph(exampleRoads))


// So, I abstracted the addEdge function and took it out of the buildGraph function
// in my example versions. This is to have fewer moving parts in the buildExampleGraph
// I also took out the sexy one liner to make it easier to read.

// The point of all this is so that I can piece together how an element in our
// exampleRoadsArray moves through the buildExampleGraph function.

// buildExampleGraph(["Alice's House-Bob's House", "Alice's House-Cabin",])
// The function that executs will go...

    // let graph = Object.create(null)
    // ["Alice's House-Bob's House", "Alice's House-Cabin"].map((element) => {
    //     // the next line "Alice's House-Bob's House" into ["Alice's House", "Bob's House"]
    //     let [start, end] = element.split('-')
    //     // the next line will take "Alice's House", "Bob's House" and update the graph object
    //     addExampleEdge(start, end, graph)
    //     // the next line will take "Bob's House", "Alice's House" and update the graph object
    //     addExampleEdge(end, start, graph)
    // })

// Cool, that makes sense. Now what's going on in our addExampleEdge function?

// addExampleEdge = ("Alice's House", "Bob's House", graph) => {
//     if (graph["Alice's House"] == null) {
//         graph["ALice's House"] = ["Bob's House"]
//     } else {
//         graph["Alice's House"].push("Bob's House")
//     }
// }