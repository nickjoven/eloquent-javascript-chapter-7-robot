// Goal is to create a delivery robot that picks up and drops off parcels and 
// to write the code starting with the most obtuse information possible.
// The robot exists in a virtual village initially represented by the roads between
// each point.

// I copied the reading into the readme, and I'm coding along with the readme and 
// adding comments to break down the code. Some times I rename parameters to be
// more specific.

// We start with an array of roads that represents the village where the robot
//  will do it's thing. Although one would expect to also have a list of parcels
// and the addresses those parcels need to go to, this exercise doesn't provide one. 

// It begins with roads...

const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

// Each element in the array seems to have two parts:
// a "start point" and an "end point" with a "-" character in between

// I guessed what the map could look like and added a .png of the drawing. It has 14
// roads and our array has 14 elements, so it should be ok.

// How can we use this information to give instructions to a robot? Continuing the reading, 
// we need to take the array of strings and create a data structure that tells us
// what each location is, and what locations it is connected to

// If it looks like I can rewrite a function as an arrow funciton, I'm doing it,
// so some of these may differ slightly than the readme.

// We want a function that will take in our roads array as an argument. 
// the purpose of the function is to use that array to create something like this:
// graph = {
//     "Alice's House": ["Bob's House", "Cabin", "Post Office"],
//     "Bob's House": ["Alice's House", "Town Hall"]
// }

// function declaration
const buildGraph = (edges) => {
    // first, we create an object that has no default properties with Object.create(null)
    let graph = Object.create(null)
    // we create an addEdge function that will take start, end as arguments and
    const addEdge = (start, end) => {
        // A) add a key to our graph called [start] with property [end] or
        if (graph[start] == null) {
            graph[start] = [end]
        // B) add a property [end] to an existing [start]. 
        } else {
            graph[start].push(end)
        }
    }
    // next we need loop that will iterate over over every element in our passed array.
    // The loop will do two things:
    // 1) take our array elemnents and convert them from strings into [start, end] arrays, and
    for (let [start, end] of edges.map((element) => element.split('-'))) {
        // 2) invoke addEdge using start, end as arguments
        addEdge(start, end)
        // addEdge runs with the start and end pieces swapped, since addEdge(start, end),
        // adds Bob's House as a property of Alice's house but not the other way around.
        // Alice's house is added as a destination of Bob's House when we run addEdge(end, start). 
        addEdge(end, start)
    }

    // I'll break things down below.
    // The first element in the array will go from "Alice's House-Bob's House" to 
    // ["Alice's House", "Bob's House"] via the .split method.
    // The use of the one line function makes that look clean but hard to interpret (to me). 
    // Here is what the code would look like as 5 lines instead of 4

    // edges.map((element) => {
    //     let [start, end] = element.split("-")
    //     addEdge(start, end)
    //     addEdge(end, start)
    // })
    
    // Personally? I find that one line functions are spooky. It's much easier to 
    // understand that we're iterating over the array with .map, then splitting
    // each element with .split, then doing the addEdge stuff.
    // Condensing the .map method and .split method onto one line hurts my small brain

    // don't forget to return.
    return graph
}

// We're done with writing that function.
// Next we create a variable that is the value of buildGraph(roads)

const roadGraph = buildGraph(roads)

// and we can check our work with console.log
console.log(roadGraph)

// Alice's House: (3) ["Bob's House", 'Cabin', 'Post Office']
// Bob's House: (2) ["Alice's House", 'Town Hall']
// Cabin: ["Alice's House"]
// ETC

// I attempted to break the code down with an example, since it's some new to me

// simplified example:
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


// I abstracted the addEdge function and took it out of the buildGraph function.
// This is bad for encapsulation, but I wanted to look at things independently.
// I also took out the sexy one liner to make it easier to read.

// The point of all this is so that I can piece together how an element in our
// exampleRoadsArray moves through the buildExampleGraph function. I added
// some console log messages to show exactly what occurs. 

// (example below is just a reminder for me to better about object properties)

// let emptyObj = {}
// console.log(emptyObj) //=>{}
// emptyObj['isEmpty'] = 'false'
// console.log(emptyObj['isEmpty'])
// console.log(emptyObj) //=>{isEmpty: 'false'}

// Cool. SO, to review, we now have a function that creates an object from the roads array. 
// It should be more usable for our goals.

// The book's next instructions:

// The task 
// Our robot will be moving around the village. There are parcels in various places, each
// addressed to some other place. The robot picks up parcels when it comes to them and 
// delivers them when it arrives at their destinations.

// -end transcription-

// We have yet to write any code for our robot. All we've done so far it convert a list of
// roads to a type of map. If we get 'eloquent' enough about it, this is the only information
// we need to write a program that tells the robot what to do. But we do need to make some
// assumptions about what we're doing. According to the book, the world will always contain
// the robot, at a location, and list of parcels and their' destinations. One might assume
// that the folks of the town need their parcels to go to a post office or other distribution
// center, but for purposes of our rogue robot, it just takes things off the front porch and
// dumps them where they go.

// So, imagine my map with packages littered about on a handful of those destinations.

// The robot will start at the post office (all the time, per the book) and then execute some
// kind of logic to decide where to go. If it encounters a parcel, what does it do? If it ends
// up at a location where it needs to drop off a parcel, what does the robot do?

// Well, actually, we have to back up. Remember, this is eloquent JavaScript.
// And the most eloquent way to handle this is to boil down everything we just said into the
// most basic components possible. That means thinking of the robot as a function, and thinking
// of the robot's location and the status of the packages as values. We want to store those
// values in something. In most basic terms, that thing is an object. But to be good, eloquent
// programmers, that should be a special object known as a class. We'll declare the class first,
// and then talk about its properties.

// If that is confusing, chapter 6, the MDN resources on class and constructor will help.


class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }

    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        } else {
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) {
                    return p;
                } else {
                    return { place: destination, address: p.address };
                }
            }).filter(p => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

// We declare a class called VillageState. As part of this declaration we include a constructor
// that names two properties, this.place and this.parcels.
// Next up, we create a method that belongs to our VillageState class called move. If we make
// any other objects that don't belong to the VillageState class, they will not have access to
// move as a method--that's encapsulation.

// What happens when we run VillageState.move(destination)?
// to break down that code, let's fist understand that this code will execute when the robot 
// wants to move, but before it actually moves, it takes care of any parcels at the location it 
// is currently at. It's probably weird to only trigger updating parcels for the current location
// when we tell the robot to leave the location, but, that's how this is written. I'm sure it could
// be done the other way around.

class exampleVillageState {
    constructor(place, parcels) {
        // place is going to be one of the places in roadGraph
        this.place = place; // place is going to be one of the places in roadGraph
        // parcels is going to be defined later, but it is an array of objects w/ a place: & address:
        this.parcels = parcels; 
    }

    // presumably, this.place begins at the post office. Let's replace destination with "Marketplace"
    exampleMove(Marketplace) {
        // we do not move to the Marketplace if it is not a valid property of Post Office
        if (!roadGraph["Post Office"].includes(Marketplace)) { 
            return this;
            // But, if it is a valid move, we execute this code: *note, we don't MOVE yet
            // Instead, we resolve any deliveries at this.place (Post Office) first 
        } else { 
            // we create what will be an array of objects just like VillageState.parcels, which will
            // serve as our updated list of parcels
            let parcels = this.parcels.map(p => { 
                // we iterate over the exVillage.parcels array and look at each object
                if (p.place != "Post Office") {
                    // if a parcel object's place property does not equal post office, we store it in
                    //  the array without doing anything to it. You'll see why below:
                    return p; 
                } else { 
                // The upcoming code does two things.
                // The book may tell you that there is a filter to remove parcels whose p.place = Post
                // Office, but the filter is only partially required. As you can imagine, if a parcel
                // belongs at this.place, it doesn't get added to parcels anywhere. So what do we add
                // from this return? A new package. Yup, we create a new package. Remember how I said
                // it would make sense for there to be a list, somewhere, of package locations and
                // destinations? Not if you're being eloquent. If you're being eloquent, your robot
                // decides that there is a new package to get, with an origin of Marketplace and an 
                // address of p.address. Which means that--if I am dropping off a package at the Post
                // Office--I am also going to pick up a package at the Marketplace for wherever each
                // package for the Post Office came from.
                // That is COMPLETE nonsense--why would a delivery robot behave in this way??? The 
                // code here is trying to do something absolutely insane!!!!!! HELP ME!!!!!!
                // So, by virtue of not being included in the truthy outcome of the if statement, 
                // we do not add the element p to the new parcels list. It's being "dropped off" which
                // just means it's being "left off of" the new list.
                // But we are also making a new package with origin Marketplace and destination
                // p.address. The text does NOT make mention of this aspect of the code.
                return { place: Marketplace, address: p.address };
                }
            // So what gets filtered here? Well, it's for this edge case. If we were delivering a
            // parcel to the Post Office from the Marketplace, and Marketplace was our next destination,
            // the else statement would create a parcel with place: Marketplace address: Marketplace
            // and we would need to get rid of that somewhere.
            // which
            // is where this fucking filter comes in
            }).filter(p => p.place != p.address);
            // and we create a new exampleVillageState with our destination as the new location, and the
            // updated parcels list as the new parcels
            return new exampleVillageState(Marketplace, parcels);
        }
    }
}

// Wow, that is some horseshit. I'll push this to github IDGAF

// See this line from the book?

// Then it creates a new state with the destination as the robot’s new place.But it also needs to 
// create a new set of parcels—parcels that the robot is carrying(that are at the robot’s current 
// place) need to be moved along to the new place.And parcels that are addressed to the new place 
// need to be delivered—that is, they need to be removed from the set of undelivered parcels. The
// call to map takes care of the moving, and the call to filter does the delivering.
// -end transmission-

// It describes the purpose of the filter in an extremely misleading way and makes no mention of the
// else statement creating a new package based on the next destination and origin of the package that
// is getting dropped off.

// I wasted a significant amount of time trying to make sense of it.

// Anyway, here is the rest of the code.

let first = new VillageState(
    "Post Office",
    [{ place: "Post Office", address: "Alice's House" }]
);
let next = first.move("Alice's House");

console.log(next.place);
// → Alice's House
console.log(next.parcels);
// → []
console.log(first.place);
// → Post Office

let object = Object.freeze({ value: 5 });
object.value = 10;
console.log(object.value);
// → 5

function runRobot(state, robot, memory) {
    for (let turn = 0; ; turn++) {
        if (state.parcels.length == 0) {
            console.log(`Done in ${turn} turns`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function randomRobot(state) {
    return { direction: randomPick(roadGraph[state.place]) };
}

VillageState.random = function (parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place = randomPick(Object.keys(roadGraph));
        } while (place == address);
        parcels.push({ place, address });
    }
    return new VillageState("Post Office", parcels);
};

// runRobot(VillageState.random(), randomRobot);

const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
];

function routeRobot(state, memory) {
    if (memory.length == 0) {
        memory = mailRoute;
    }
    return { direction: memory[0], memory: memory.slice(1) };
}

function findRoute(graph, from, to) {
    let work = [{ at: from, route: [] }];
    for (let i = 0; i < work.length; i++) {
        let { at, route } = work[i];
        for (let place of graph[at]) {
            if (place == to) return route.concat(place);
            if (!work.some(w => w.at == place)) {
                work.push({ at: place, route: route.concat(place) });
            }
        }
    }
}

function goalOrientedRobot({ place, parcels }, route) {
    if (route.length == 0) {
        let parcel = parcels[0];
        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
        } else {
            route = findRoute(roadGraph, place, parcel.address);
        }
    }
    return { direction: route[0], memory: route.slice(1) };
}

runRobotAnimation(VillageState.random(),
    goalOrientedRobot, []);